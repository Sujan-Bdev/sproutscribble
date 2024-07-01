'use server';

import { LoginSchema } from '@/types/loginSchema';
import { createSafeActionClient } from 'next-safe-action';
import { db } from '@/server';
import { eq } from 'drizzle-orm';
import { users } from '../schema';
import { generateEmailVerificationToken } from './tokens';
import { sendVerificationEmail } from './email';
import { signIn } from '../auth';
import { AuthError } from 'next-auth';
import { isRedirectError } from 'next/dist/client/components/redirect';

const actionClient = createSafeActionClient();

export const emailSignIn = actionClient
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password, code } }) => {
    try {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (!existingUser?.email === email) {
        return { error: 'User not found' };
      }
      if (!existingUser?.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(
          existingUser?.email!
        );

        await sendVerificationEmail(
          verificationToken[0].email,
          verificationToken[0].token
        );
        return { success: 'Confirmation Email Sent' };
      }

      await signIn('credentials', {
        email,
        password,
        redirectTo: '/',
      
      });
      return { success: email };
    } catch (error) {
      console.log(error);
      
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return { error: 'Email or Password incorrect' };
            break;
          case 'AccessDenied':
            return { error: error.message };
            break;
          case 'OAuthSignInError':
            return { error: error.message };
          default:
            return { error: 'Something went wrong' };
            break;
        }
      }
      throw error;
    }
  });

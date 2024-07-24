'use server';

import { createSafeActionClient } from 'next-safe-action';
import bcrypt from 'bcrypt';
import { db } from '@/server';
import { users } from '../schema';
import { RegisterSchema } from '@/types/registerSchema';
import { eq } from 'drizzle-orm';
import { generateEmailVerificationToken } from './tokens';
import { sendVerificationEmail } from './email';

const actionClient = createSafeActionClient();

export const emailRegister = actionClient
  .schema(RegisterSchema)
  .action(async ({ parsedInput: { email, password, name } }) => {
    //  hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // check existing user
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(email);
        await sendVerificationEmail(
          verificationToken[0].email,
          verificationToken[0].token
        );
        return { success: 'Email confirmation resent' };
      }
      return { error: 'Email already in use' };
    }

    // Logic for when the user is not registered
    await db.insert(users).values({
      email,
      name,
      password: hashedPassword.toString(),
    });
    const verificationToken = await generateEmailVerificationToken(email);
    await sendVerificationEmail(
      verificationToken[0].email,
      verificationToken[0].token
    );
    return { success: 'Confirmation email sent!' };
  });

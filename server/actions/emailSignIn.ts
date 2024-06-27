'use server';

import { LoginSchema } from '@/types/loginSchema';
import { createSafeActionClient } from 'next-safe-action';
import { db } from '@/server';
import { eq } from 'drizzle-orm';
import { users } from '../schema';

const actionClient = createSafeActionClient();

export const emailSignIn = actionClient
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password, code } }) => {
    console.log(email, password, code);
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if(!existingUser?.email=== email){
        return {error: "User not found"}
    }
    // if(!existingUser?.emailVerified){

    // }
    return { success: email };
  });

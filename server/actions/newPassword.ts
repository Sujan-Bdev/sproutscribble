'use server';

import { NewPasswordSchema } from '@/types/newPasswordSchema';
import { createSafeActionClient } from 'next-safe-action';
import { db } from '@/server';
import { eq } from 'drizzle-orm';
import { passwordResetTokens, users } from '../schema';
import { getPasswordResetTokenByToken } from './tokens';
import bcrypt from 'bcrypt';
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

const actionClient = createSafeActionClient();

export const newPassword = actionClient
  .schema(NewPasswordSchema)
  .action(async ({ parsedInput: { password, token } }) => {
    const pool = new Pool({ connectionString: process.env.POSTGRES_URL });
    const dbPool = drizzle(pool);

    if (!token) {
      return { error: 'Missing token' };
    }

    const existingToken = await getPasswordResetTokenByToken(token);

    if (!existingToken) {
      return { error: 'Token not found' };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      return { error: 'Token has expired' };
    }

    const existingUser = db.query.users.findFirst({
      where: eq(users.email, existingToken.email),
    });

    if (!existingUser) {
      return { error: 'User not found' };
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await dbPool.transaction(async tx => {
      await tx
        .update(users)
        .set({
          password: hashedPassword,
        })
        .where(eq(users.email, existingToken.email));

      await tx
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.email, existingToken.email));
    });
    return { success: 'Password updated' };
  });

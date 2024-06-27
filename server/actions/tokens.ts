'use server';

import { db } from '@/server';
import { eq } from 'drizzle-orm';
import { emailTokens } from '../schema';
import { createId } from '@paralleldrive/cuid2';

export async function getVerificationTokenByEmail(email: string) {
  const verificationToken = await db.query.emailTokens.findFirst({
    where: eq(emailTokens.token, email),
  });
  return verificationToken;
}

export const generateEmailVerificationToken = async (email: string) => {
  const token = crypto.randomUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id));
  }
  const verificationToken = await db
    .insert(emailTokens)
    .values({
      email,
      token,
      expires,
    })
    .returning();

  return verificationToken;
};

'use server';

import { db } from '@/server';
import { eq } from 'drizzle-orm';
import { emailTokens, users } from '../schema';

export async function getVerificationTokenByEmail(email: string) {
  const verificationToken = await db.query.emailTokens.findFirst({
    where: eq(emailTokens.email, email),
  });
  return verificationToken;
}

export const generateEmailVerificationToken = async (email: string) => {
  const token = crypto.randomUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const existingToken = await getVerificationTokenByEmail(email);
  console.log(`the email i got in token is: ${email}`);

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

export const newVerification = async (token: string) => {
  const existingToken = await db.query.emailTokens.findFirst({
    where: eq(emailTokens.token, token),
  });

  if (!existingToken) {
    return { error: 'Token not found' };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: 'Token has expired' };
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, existingToken.email),
  });

  if (!existingUser) {
    return { error: 'Email does not exist' };
  }

  await db
    .update(users)
    .set({
      emailVerified: new Date(),
    })
    .where(eq(users.email, existingToken.email));

  await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id));
  return { success: 'Email Verified' };
};

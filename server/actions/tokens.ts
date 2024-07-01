'use server';

import { db } from '@/server';
import { eq } from 'drizzle-orm';
import { emailTokens, passwordResetTokens, users } from '../schema';
import { randomUUID } from 'crypto';

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

export const getPasswordResetTokenByToken = async (token: string) => {
  const passwordResetToken = await db.query.passwordResetTokens.findFirst({
    where: eq(passwordResetTokens.token, token),
  });
  return passwordResetToken;
};
export async function getPasswordResetTokenByEmail(email: string) {
  const verificationToken = await db.query.passwordResetTokens.findFirst({
    where: eq(passwordResetTokens.email, email),
  });
  return verificationToken;
}

export const generatePasswordResetToken = async (email: string) => {
  const token = crypto.randomUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.id, existingToken.id));
  }

  const passwordResetToken = await db
    .insert(passwordResetTokens)
    .values({
      token,
      email,
      expires,
    })
    .returning();

  return passwordResetToken;
};

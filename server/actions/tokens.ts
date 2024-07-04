'use server';

import { db } from '@/server';
import { eq } from 'drizzle-orm';
import {
  emailTokens,
  passwordResetTokens,
  twoFactorTokens,
  users,
} from '../schema';
import { randomUUID, randomInt } from 'crypto';
import crypto from 'crypto';

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

export const getTwoFactorTokenByEmail = async (email: string) => {
  const twoFactorToken = await db.query.twoFactorTokens.findFirst({
    where: eq(twoFactorTokens.email, email),
  });
  return twoFactorToken;
};

export const getTwoFactorTokenByToken = async (token: string) => {
  const twoFactorToken = await db.query.twoFactorTokens.findFirst({
    where: eq(twoFactorTokens.token, token),
  });
  return twoFactorToken;
};

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_100, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const existingToken = await getTwoFactorTokenByEmail(email);

  if (existingToken) {
    await db
      .delete(twoFactorTokens)
      .where(eq(twoFactorTokens.id, existingToken.id));
  }

  const twoFactorToken = await db
    .insert(twoFactorTokens)
    .values({
      token,
      email,
      expires,
    })
    .returning();

  return twoFactorToken;
};

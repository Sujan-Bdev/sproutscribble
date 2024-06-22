'use client';
import React from 'react';
import AuthCard from './AuthCard';

export default function LoginForm() {
  return (
    <AuthCard
      cardTitle="Welcome back!"
      backButtonHref="/auth/register"
      backButtonLabel="Create a new account"
      showSocials={true}
    >
      <div>Hey</div>
    </AuthCard>
  );
}

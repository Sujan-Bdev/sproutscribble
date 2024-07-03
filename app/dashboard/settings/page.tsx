import { auth } from '@/server/auth';
import { redirect } from 'next/navigation';
import React from 'react';
import SettingsCard from './SettingsCard';

export default async function Settings() {
  const session = await auth();
  if (!session) {
    redirect('/');
  }

  if (session) {
    return <SettingsCard session={session} />;
  }
}

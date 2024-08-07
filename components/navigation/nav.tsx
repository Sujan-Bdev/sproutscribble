import { auth } from '@/server/auth';

import React from 'react';
import UserButton from './user-button';
import { Button } from '../ui/button';
import Link from 'next/link';
import { LogIn } from 'lucide-react';
import Logo from './logo';
import CartDrawer from '../cart/CartDrawer';

export default async function Nav() {
  const session = await auth();
  return (
    <header className="py-8 ">
      <nav>
        <ul className="flex justify-between items-center md:gap-8 gap-4">
          <li className="flex flex-1">
            <Link href="/" aria-label="sprout and scribble logo">
              <Logo />
            </Link>
          </li>
          <li className="relative flex items-center hover:bg-muted">
            <CartDrawer />
          </li>
          {!session ? (
            <li className="flex items-center justify-center">
              <Button asChild>
                <Link href="/auth/login" className="flex gap-2">
                  <LogIn size={16} />
                  <span>Login</span>{' '}
                </Link>
              </Button>
            </li>
          ) : (
            <li className="flex items-center justify-center">
              <UserButton user={session?.user} expires={session?.expires!} />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

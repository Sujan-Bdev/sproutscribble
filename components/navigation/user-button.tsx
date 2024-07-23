'use client';
import { LogOut, Moon, Settings, Sun, Truck } from 'lucide-react';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UserButton({ user }: Session) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const [checked, setChecked] = useState(false);
  function setSwitchState() {
    switch (theme) {
      case 'dark':
        return setChecked(true);
      case 'light':
        return setChecked(false);
      case 'system':
        return setChecked(false);
    }
  }
  if (user) {
    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>
          <Avatar className="w-7 h-7">
            <AvatarImage src={user.image!} />
            <AvatarFallback className="font-bold bg-primary/25">
              {user?.name
                ?.split(' ')
                .map(name => name[0])
                .join('')
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 p-6" align="end">
          <div className="mb-4 p-4 gap-1 flex flex-col items-center rounded-lg bg-primary/10">
            {user?.image && (
              <Image
                src={user.image}
                alt={user.name!}
                className="rounded-full"
                width={36}
                height={36}
              />
            )}
            <p className="font-bold text-xs">{user?.name} </p>
            <span className="text-xs font-medium text-secondary-foreground ">
              {user?.email}{' '}
            </span>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => router.push('/dashboard/orders')}
            className="group py-2 font-medium cursor-pointer"
          >
            <Truck
              className=" px-1 mr-2 text-primary group-hover:translate-x-1 transition-all duration-300 ease-in-out"
              size={24}
            />{' '}
            My Orders
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push('/dashboard/settings')}
            className=" group py-2 font-medium cursor-pointer"
          >
            <Settings
              className=" px-1 mr-1 text-primary group-hover:rotate-180 transition-all duration-300 ease-in-out"
              size={24}
            />{' '}
            Settings
          </DropdownMenuItem>
          {theme && (
            <DropdownMenuItem className="group py-2 font-medium cursor-pointer">
              <div
                className="flex items-center group"
                onClick={e => e.stopPropagation()}
              >
                {theme === 'light' && (
                  <Sun
                    className=" px-1 mr-1 text-primary group-hover:text-yellow-600 group-hover:rotate-180 transition-all duration-300 ease-in-out"
                    size={24}
                  />
                )}

                {theme === 'dark' && (
                  <Moon
                    className=" px-1 mr-1 text-primary group-hover:text-blue-400 transition-all duration-300 ease-in-out"
                    size={24}
                  />
                )}

                <p className="dark:text-blue-400 text-secondary-foreground/75  text-yellow-600">
                  {theme[0].toUpperCase() + theme?.slice(1)} Mode
                </p>
                <Switch
                  className="scale-75"
                  checked={checked}
                  onCheckedChange={e => {
                    setChecked(prev => !prev);
                    if (e) setTheme('dark');
                    if (!e) setTheme('light');
                  }}
                />
              </div>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            onClick={() => signOut()}
            className="group focus:bg-destructive/30 py-2 font-medium cursor-pointer"
          >
            <LogOut
              className=" px-1 mr-1 text-primary group-hover:scale-75 transition-all duration-300"
              size={24}
            />{' '}
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}

'use client';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import React from 'react';
import { Truck } from 'lucide-react';
import { Settings } from 'lucide-react';
import { Sun } from 'lucide-react';
import { Moon } from 'lucide-react';
import { LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';

export default function UserButton({ user }: Session) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image!} />
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
        <div className="mb-4 p-4 gap-1 flex flex-col items-center rounded-lg bg-primary/25">
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
        <DropdownMenuItem className="group py-2 font-medium cursor-pointer transition-all duration-500">
          <Truck
            className=" px-1 mr-2 text-primary group-hover:translate-x-1 transition-all duration-300 ease-in-out"
            size={24}
          />{' '}
          My Orders
        </DropdownMenuItem>
        <DropdownMenuItem className=" group py-2 font-medium cursor-pointer transition-all duration-500">
          <Settings
            className=" px-1 mr-1 text-primary group-hover:rotate-180 transition-all duration-300 ease-in-out"
            size={24}
          />{' '}
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem className="group py-2 font-medium cursor-pointer transition-all duration-500">
          <div className="flex items-center ">
            <Sun
              className=" px-1 mr-1 text-primary group-hover:translate-x-1 transition-all duration-300"
              size={24}
            />
            <Moon
              className=" px-1 mr-1 text-primary group-hover:translate-x-1 transition-all duration-300"
              size={24}
            />
            <p>
              Theme <span>theme</span>
            </p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => signOut()}
          className="group focus:bg-destructive/30 py-2 font-medium cursor-pointer transition-all duration-500"
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

'use client';
import React, { useState } from 'react';
import { z } from 'zod';
import AuthCard from './AuthCard';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useAction } from 'next-safe-action/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema } from '@/types/registerSchema';
import { emailSignIn } from '@/server/actions/emailSignIn';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { emailRegister } from '@/server/actions/emailRegister';
import FormSuccess from './FormSuccess';
import FormError from './FormError';

export default function RegisterForm() {
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const { execute, result, status } = useAction(emailRegister, {
    onSuccess(data) {
      if (data.data?.error) {
        setError(data.data?.error);
      }
      if (data.data?.success) {
        setSuccess(data.data?.success);
      }
    },
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function onSubmit(values: z.infer<typeof RegisterSchema>) {
    execute(values);
  }

  return (
    <>
      <AuthCard
        cardTitle="Create an account"
        backButtonHref="/auth/login"
        backButtonLabel="Already have an account?"
        showSocials={true}
      >
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="name" type="text" {...field} />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="email"
                          type="email"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="********"
                          type="password"
                          autoComplete="current-password"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormSuccess message={success} />
                <FormError message={error} />
                <Button size={'sm'} variant={'link'} asChild>
                  <Link href="/auth/reset">Forgot your password ?</Link>
                </Button>
              </div>
              <Button
                type="submit"
                className={cn(
                  'w-full my-2',
                  status === 'executing' ? 'animate-pulse' : ''
                )}
              >
                {'Register'}
              </Button>
            </form>
          </Form>
        </div>
      </AuthCard>
    </>
  );
}

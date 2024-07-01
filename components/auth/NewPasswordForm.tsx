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
import { LoginSchema } from '@/types/loginSchema';
import { emailSignIn } from '@/server/actions/emailSignIn';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import FormSuccess from './FormSuccess';
import FormError from './FormError';
import { NewPasswordSchema } from '@/types/newPasswordSchema';
import { newPassword } from '@/server/actions/newPassword';
import { useParams, useSearchParams } from 'next/navigation';

export default function NewPasswordForm() {
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: '',
    },
  });

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const { execute, result, status } = useAction(newPassword, {
    onSuccess(data) {
      if (data.data?.error) {
        setError(data?.data?.error);
      }
      if (data?.data?.success) {
        setSuccess(data?.data.success);
      }
    },
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function onSubmit(values: z.infer<typeof NewPasswordSchema>) {
    execute({ password: values.password, token });
  }

  return (
    <>
      <AuthCard
        cardTitle="Enter a new Password"
        backButtonHref="/auth/login"
        backButtonLabel="Back to login"
        showSocials={true}
      >
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div>
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
                          disabled={status === 'executing'}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button size={'sm'} variant={'link'} asChild>
                  <Link href="/auth/reset">Forgot your password ?</Link>
                </Button>
              </div>
              <FormSuccess message={success} />
              <FormError message={error} />
              <Button
                type="submit"
                className={cn(
                  'w-full my-2',
                  status === 'executing' ? 'animate-pulse' : ''
                )}
              >
                {'Reset Password'}
              </Button>
            </form>
          </Form>
        </div>
      </AuthCard>
    </>
  );
}

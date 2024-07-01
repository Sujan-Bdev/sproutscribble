'use client';
import { cn } from '@/lib/utils';
import { passwordReset } from '@/server/actions/passwordReset';
import { ResetSchema } from '@/types/resetSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import AuthCard from './AuthCard';
import FormError from './FormError';
import FormSuccess from './FormSuccess';

export default function ResetPasswordForm() {
  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: '',
    },
  });

  const { execute, result, status } = useAction(passwordReset, {
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

  function onSubmit(values: z.infer<typeof ResetSchema>) {
    execute(values);
  }

  return (
    <>
      <AuthCard
        cardTitle="Forgot Your Password?"
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="email"
                          type='email'
                          autoComplete="email"
                          disabled= {status=== 'executing'}
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

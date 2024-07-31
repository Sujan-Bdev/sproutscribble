'use client';

import { TotalOrders } from '@/lib/infer-type';
import React, { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { weeklyChart } from './weeklyChart';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ResponsiveContainer,
} from 'recharts';
import { monthlyChart } from './monthlyChart';

export default function Earnings({
  totalOrders,
}: {
  totalOrders: TotalOrders[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter') || 'week';

  const chartItems = totalOrders.map(order => ({
    date: order.order.created!,
    revenue: order.order.total,
  }));
  const activeChart = useMemo(() => {
    const weekly = weeklyChart(chartItems);
    const monthly = monthlyChart(chartItems);
    if (filter === 'week') {
      return weekly;
    }
    if (filter === 'month') {
      return monthly;
    }
  }, [filter]);

  const activeTotal = useMemo(() => {
    if (filter === 'month') {
      return monthlyChart(chartItems).reduce(
        (acc, item) => acc + item.revenue,
        0
      );
    }
    return weeklyChart(chartItems).reduce(
      (acc, item) => acc + Number(item.revenue),
      0
    );
  }, [filter]);
  return (
    <Card className="flex-1 shrink-0 h-full">
      <CardHeader>
        <CardTitle>Your Revenue: ${activeTotal}</CardTitle>
        <CardDescription>Here are your recent earnings.</CardDescription>
        <div className="flex items-center gap-2">
          <Badge
            className={cn(
              'cursor-pointer',
              filter === 'week' ? 'bg-primary' : 'bg-primary/25'
            )}
            onClick={() =>
              router.push('/dashboard/analytics/?filter=week', {
                scroll: false,
              })
            }
          >
            This Week
          </Badge>
          <Badge
            className={cn(
              'cursor-pointer',
              filter === 'month' ? 'bg-primary' : 'bg-primary/25'
            )}
            onClick={() =>
              router.push('/dashboard/analytics/?filter=month', {
                scroll: false,
              })
            }
          >
            This Month
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart width={150} height={40} data={activeChart}>
            <Tooltip
              content={(props: { payload: any[] }) => (
                <div>
                  {props.payload?.map(item => {
                    return (
                      <div
                        className="bg-primary text-white py-2 px-4 rounded-md shadow-lg"
                        key={item.payload.date}
                      >
                        <p>Revenue: ${item.value}</p>
                        <p>Date: {item.payload.date}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            />
            <Bar dataKey="revenue" className="fill-primary" />
            <YAxis dataKey="revenue" />
            <XAxis dataKey="date" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

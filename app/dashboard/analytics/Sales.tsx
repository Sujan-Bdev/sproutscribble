import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TotalOrders } from '@/lib/infer-type';
import Image from 'next/image';
import placeholderUser from '@/public/placeholder-user.png';

export default function Sales({ totalOrders }: { totalOrders: TotalOrders[] }) {
  const sliced = totalOrders.slice(0, 8);
  return (
    <Card>
      <CardHeader>
        <CardTitle>New Sales</CardTitle>
        <CardDescription>Here are your recent sales</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">Customer</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="">Quantity</TableHead>
              <TableHead>Image</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sliced.map(order => (
              <TableRow key={order.id} className="font-medium">
                <TableCell className="">
                  {order.order.user.image && order.order.user.name ? (
                    <div className="flex items-center gap-2 w-32">
                      <Image
                        className="rounded-full"
                        src={order.order.user.image!}
                        width={25}
                        height={25}
                        alt={order.order.user.name!}
                      />
                      <p className="text-xs font-medium">
                        {' '}
                        {order.order.user.name}{' '}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Image
                        className="rounded-full"
                        src={placeholderUser.src!}
                        width={25}
                        height={25}
                        alt="user not found"
                      />
                      <p className="text-xs font-medium">User not found</p>
                    </div>
                  )}
                </TableCell>
                <TableCell>{order.product.title}</TableCell>
                <TableCell> {order.product.price} </TableCell>
                <TableCell className=""> {order.quantity}</TableCell>
                <TableCell>
                  <Image
                    src={order.productVariants.variantImages[0].url}
                    width={48}
                    height={48}
                    alt={order.product.title}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

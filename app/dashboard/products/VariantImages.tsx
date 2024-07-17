'use client';

import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { zVariantSchema } from '@/types/variantSchema';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Reorder } from 'framer-motion';
import { UploadDropzone } from '@/app/api/uploadthing/upload';
import { Trash } from 'lucide-react';
import { useState } from 'react';

export default function VariantImages() {
  const { getValues, control, setError } = useFormContext<zVariantSchema>();

  const { fields, remove, append, update, move } = useFieldArray({
    control,
    name: 'variantImages',
  });
  const [active, setActive] = useState(0)
  return (
    <div>
      <FormField
        control={control}
        name="variantImages"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Variant Images</FormLabel>
            <FormControl>
              <UploadDropzone
                className="ut-allowed-content:text-secondary-foreground ut-label:text-primary
                ut-upload-icon:text-primary/50 hover:bg-primary/10 transition-all duration-500 ease-in-out
                border-secondary ut-button:bg-primary/75 ut-button:ut-readying:bg-secondary"
                endpoint="variantUploader"
                config={{ mode: 'auto' }}
                onUploadError={error => {
                  setError('variantImages', {
                    type: 'validate',
                    message: error.message,
                  });
                  return;
                }}
                onBeforeUploadBegin={files => {
                  files.map(file =>
                    append({
                      name: file.name,
                      size: file.size,
                      url: URL.createObjectURL(file),
                    })
                  );
                  return files;
                }}
                onClientUploadComplete={files => {
                  const images = getValues('variantImages');
                  images.map((field, imgIdx) => {
                    if (field.url.search('blob:') === 0) {
                      const image = files.find(img => img.name === field.name);
                      if (image) {
                        update(imgIdx, {
                          url: image.url,
                          name: image.name,
                          size: image.size,
                          key: image.key,
                        });
                      }
                    }
                  });
                  return;
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <Reorder.Group as="tbody" values={fields} onReorder={(e)=>{
            const activeElement = fields[active];
            e.map((item,index)=> {
                if(item===activeElement){
                    move(active,index)
                    setActive(index)
                    return
                }
                return
            })
          } } >
            {fields.map((field, index) => {
              return (
                <Reorder.Item as = "tr"
                  key={field.id}
                  id={field.id}
                  value={field}
                  onDragStart={()=> setActive(index)}
                  className={cn(
                    'text-sm font-bold text-muted-foreground hover:text-primary',
                    field.url.search('blob:') === 0
                      ? 'animate-pulse transition-all'
                      : ''
                  )}
                >
                  <TableCell className="">{index} </TableCell>
                  <TableCell>{field.name} </TableCell>
                  <TableCell>
                    {(field.size / (1024 * 1024)).toFixed(2)}MB{' '}
                  </TableCell>
                  <TableCell className="">
                    <div className="flex items-center justify-center">
                      <Image
                        src={field.url}
                        alt={field.name}
                        className="rounded-md"
                        width={72}
                        height={48}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      className="scale-75"
                      onClick={e => {
                        e.preventDefault();
                        remove(index);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        </Table>
      </div>
    </div>
  );
}

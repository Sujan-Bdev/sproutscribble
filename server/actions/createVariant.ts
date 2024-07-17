'use server';

import { VariantSchema } from '@/types/variantSchema';
import { eq } from 'drizzle-orm';
import { createSafeActionClient } from 'next-safe-action';
import { revalidatePath } from 'next/cache';
import { db } from '..';
import { productVariants, variantImages, variantTags } from '../schema';

const actionClient = createSafeActionClient();

export const createVariant = actionClient
  .schema(VariantSchema)
  .action(
    async ({
      parsedInput: {
        color,
        editMode,
        id,
        productID,
        productType,
        tags,
        variantImages: newImgs,
      },
    }) => {
      try {
        if (editMode && id) {
          const editVariant = await db
            .update(productVariants)
            .set({
              color,
              productType,
              updated: new Date(),
            })
            .where(eq(productVariants.id, id))
            .returning();
          await db
            .delete(variantTags)
            .where(eq(variantTags.variantID, editVariant[0].id));
          await db.insert(variantTags).values(
            tags.map((tag: any) => ({
              tag,
              variantID: editVariant[0].id,
            }))
          );

          await db
            .delete(variantImages)
            .where(eq(variantImages.variantID, editVariant[0].id));

          await db.insert(variantImages).values(
            newImgs.map((img: any, index: any) => ({
              name: img.name,
              size: img.size,
              url: img.url,
              order: index,
              variantID: editVariant[0].id,
            }))
          );
          revalidatePath('/dashboard/products');
          return { success: `Edited ${productType}` };
        }
        if (!editMode) {
          const newVariant = await db
            .insert(productVariants)
            .values({
              color,
              productType,
              productID,
            })
            .returning();
          await db.insert(variantTags).values(
            tags.map((tag: any) => ({
              tag,
              variantID: newVariant[0].id,
            }))
          );
          await db.insert(variantImages).values(
            newImgs.map((img: any, index: any) => ({
              name: img.name,
              size: img.size,
              url: img.url,
              order: index,
              variantID: newVariant[0].id,
            }))
          );
          revalidatePath('/dashboard/products');
          return { success: `Added ${productType}` };
        }
      } catch (error) {
        return { error: 'Failed to create variant' };
      }
    }
  );

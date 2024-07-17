'use server';

import { VariantSchema } from '@/types/variantSchema';
import { eq } from 'drizzle-orm';
import { createSafeActionClient } from 'next-safe-action';
import { revalidatePath } from 'next/cache';
import { db } from '..';
import {
  products,
  productVariants,
  variantImages,
  variantTags,
} from '../schema';
import algoliaSearch from 'algoliasearch';

const client = algoliaSearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID!,
  process.env.ALGOLIA_ADMIN!
);

const algoliaIndex = client.initIndex('products');
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
          algoliaIndex.partialUpdateObject({
            objectID: editVariant[0].id.toString(),
            id: editVariant[0].productID,
            type: editVariant[0].productType,
            variantImages: newImgs[0].url,
          });
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
          const product = await db.query.products.findFirst({
            where: eq(products.id, productID),
          });
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
          if (product) {
            algoliaIndex.saveObject({
              objectID: newVariant[0].id.toString(),
              id: newVariant[0].productID,
              title: product.title,
              price: product.price,
              type: newVariant[0].productType,
              variantImages: newImgs[0].url,
            });
          }
          revalidatePath('/dashboard/products');
          return { success: `Added ${productType}` };
        }
      } catch (error) {
        return { error: 'Failed to create variant' };
      }
    }
  );

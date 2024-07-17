import { createId } from '@paralleldrive/cuid2';
import { timeStamp } from 'console';
import { InferSelectModel, relations } from 'drizzle-orm';
import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum,
  serial,
  numeric,
  real,
} from 'drizzle-orm/pg-core';
import type { AdapterAccountType } from 'next-auth/adapters';

export const RoleEnum = pgEnum('roles', ['user', 'admin']);

export const users = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  password: text('password'),
  image: text('image'),
  twoFactorEnabled: boolean('twoFactorEnabled').default(false),
  role: RoleEnum('roles').default('user'),
});

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  account => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const emailTokens = pgTable(
  'email_tokens',
  {
    id: text('id')
      .notNull()
      .$defaultFn(() => createId()),
    token: text('token').notNull(),
    email: text('email').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  verificationToken => ({
    compositePk: primaryKey({
      columns: [verificationToken.id, verificationToken.token],
    }),
  })
);

export const passwordResetTokens = pgTable(
  'password_reset_tokens',
  {
    id: text('id')
      .notNull()
      .$defaultFn(() => createId()),
    token: text('token').notNull(),
    email: text('email').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  verificationToken => ({
    compositePk: primaryKey({
      columns: [verificationToken.id, verificationToken.token],
    }),
  })
);

export const twoFactorTokens = pgTable(
  'two_factor_tokens',
  {
    id: text('id')
      .notNull()
      .$defaultFn(() => createId()),
    userId: text('userId').references(() => users.id, { onDelete: 'cascade' }),
    token: text('token').notNull(),
    email: text('email').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  verificationToken => ({
    compositePk: primaryKey({
      columns: [verificationToken.id, verificationToken.token],
    }),
  })
);

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  price: real('price').notNull(),
  created: timestamp('created').defaultNow(),
});

export const productVariants = pgTable('productVariants', {
  id: serial('id').primaryKey(),
  color: text('color').notNull(),
  productType: text('productType').notNull(),
  updated: timestamp('updated').defaultNow(),
  productID: serial('productID')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
});

export const variantImages = pgTable('variantImages', {
  id: serial('id').primaryKey(),
  url: text('url').notNull(),
  size: real('size').notNull(),
  name: text('name').notNull(),
  order: real('order').notNull(),
  variantID: serial('variantID')
    .notNull()
    .references(() => productVariants.id, { onDelete: 'cascade' }),
});

export const variantTags = pgTable('variantTags', {
  id: serial('id').primaryKey(),
  tag: text('tag').notNull(),
  variantID: serial('variantID')
    .notNull()
    .references(() => productVariants.id, { onDelete: 'cascade' }),
});

export const productRelations = relations(products, ({ many }) => ({
  productVariants: many(productVariants, {
    relationName: 'productVariants',
  }),
}));

export const productVariantsRelations = relations(
  productVariants,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productVariants.productID],
      references: [products.id],
      relationName: 'productVariants',
    }),
    variantImages: many(variantImages, { relationName: 'variantImages' }),
    variantTags: many(variantTags, { relationName: 'variantTags' }),
  })
);

export const variantImagesRelations = relations(variantImages, ({ one }) => ({
  productVariants: one(productVariants, {
    fields: [variantImages.variantID],
    references: [productVariants.id],
    relationName: 'variantImages',
  }),
}));

export const variantTagsRelations = relations(variantTags, ({ one }) => ({
  productVariants: one(productVariants, {
    fields: [variantTags.variantID],
    references: [productVariants.id],
    relationName: 'variantTags',
  }),
}));

export type Products = InferSelectModel<typeof products>;

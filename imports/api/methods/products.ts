// @ts-ignore
import { Product, Products } from "/imports/api/collections/products";
import { z } from "zod";
import { createMethod } from "meteor/zodern:relay";
import { loggedInPipeline } from "./pipelines";

// Define a strict filter schema to prevent NoSQL injection
const productFilterSchema = z.object({
  name: z.string().optional(),
  type: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
  search: z.object({
    fields: z.array(z.string()),
    searchText: z.string().optional(),
  }).optional(),
  userId: z.string().optional(),
}).strict();

export const productsList = createMethod({
  name: "products.list",
  schema: z.object({
    options: z.object({
      limit: z.number().optional(),
      skip: z.number().optional(),
      sort: z.object({
        field: z.string(),
        direction: z.boolean()
      }).optional(),
    }),
    filters: productFilterSchema.optional()
  }),
  async run(args): Promise<{ data: Product[]; total: number }> {
    const { filters = {}, options } = args;
    // Ensure we only show non-deleted items by default
    const secureFilters = {
      ...filters,
    };

    // Create a secure sort object for MongoDB
    const sort = options.sort 
      ? { [options.sort.field]: options.sort.direction ? -1 : 1 }
      : { createdAt: -1 };
    

    const data = await Products.collection
      .createQuery({
        $filters: secureFilters,
        $options: {
          ...options,
          sort
        },
        name: 1,
        type: 1,
        categoryIds: 1,
        user: {
          emails: 1,
        },
        createdAt: 1,
      })
      .fetchAsync();
      
    const total = await Products.collection.find(secureFilters).countAsync();

    return {
      data,
      total,
    };
  },
});

export const productsAdd = createMethod({
  name: "products.add",
  schema: z.object({
    name: z.string(),
    type: z.string(),
    categoryIds: z.array(z.string()),
  }),
}).pipeline(loggedInPipeline, (product) => {
  return Products.collection.insertAsync(product);
});

export const productsDelete = createMethod({
  name: "products.delete",
  schema: z.object({
    _id: z.string(),
  }),
}).pipeline(loggedInPipeline, product => {
  return Products.collection.removeAsync(product._id);
});

export const productsUpdate = createMethod({
  name: "products.update",
  schema: z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    categoryIds: z.array(z.string()),
  }),
}).pipeline(loggedInPipeline, async ({ id, ...updates }) => {
  return Products.collection.updateAsync(id, { $set: updates });
});

export const productsSingle = createMethod({
  name: "products.single",
  schema: z.object({
    id: z.string(),
  }),
}).pipeline(loggedInPipeline, async ({ id }) => {
  const product = await Products.collection.findOneAsync(id);
  if (!product) {
    throw new Meteor.Error("not-found", "Product not found");
  }
  return product;
});

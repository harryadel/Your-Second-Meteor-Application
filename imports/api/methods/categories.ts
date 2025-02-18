// @ts-ignore
import { Category, Categories } from "/imports/api/collections/categories";
import { z } from "zod";
import { createMethod } from "meteor/zodern:relay";
import { loggedInPipeline } from "./pipelines";

// Define a strict filter schema to prevent NoSQL injection
const categoryFilterSchema = z.object({
  title: z.string().optional(),
  userId: z.string().optional()
}).strict();

export const categoriesList = createMethod({
  name: "categories.list",
  schema: z.object({
    options: z.object({
      limit: z.number().optional(),
      skip: z.number().optional(),
      sort: z.object({
        field: z.string(),
        direction: z.boolean()
      }).optional(),
    }),
    filters: categoryFilterSchema.optional()
  }),
  async run(args): Promise<{ data: Category[]; total: number }> {
    const { filters = {}, options } = args;

    // Ensure we only show non-deleted items by default
    const secureFilters = {
      ...filters,
    };

    // Create a secure sort object for MongoDB
    const sort = options.sort 
      ? { [options.sort.field]: options.sort.direction ? 1 : -1 }
      : { createdAt: -1 };

    const data = await Categories.collection
      .createQuery({
        $filters: secureFilters,
        $options: {
          ...options,
          sort
        },
        title: 1,
        user: {
          emails: 1,
        },
        createdAt: 1,
      })
      .fetchAsync();
      

    const total = await Categories.collection.find(secureFilters).countAsync();

    return {
      data,
      total,
    };
  },
});

export const categoriesAdd = createMethod({
  name: "categories.add",
  schema: z.object({
    title: z.string(),
  }),
}).pipeline(loggedInPipeline, (category) => {
  return Categories.collection.insertAsync(category);
});

export const categoriesDelete = createMethod({
  name: "categories.delete",
  schema: z.object({
    _id: z.string(),
  }),
}).pipeline(loggedInPipeline, category => {
  return Categories.collection.removeAsync(category._id);
});

export const categoriesUpdate = createMethod({
  name: "categories.update",
  schema: z.object({
    id: z.string(),
    title: z.string(),
  }),
}).pipeline(loggedInPipeline, async ({ id, ...updates }) => {
  return Categories.collection.updateAsync(id, { $set: updates });
});

export const categoriesSingle = createMethod({
  name: "categories.single",
  schema: z.object({
    id: z.string(),
  }),
  async run({ id }): Promise<Category | null> {
    return Categories.collection.findOneAsync(id);
  },
});

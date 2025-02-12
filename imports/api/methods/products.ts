// @ts-ignore
import { Product, Products } from "/imports/api/collections/products";
import { z } from "zod";
import { createMethod } from "meteor/zodern:relay";
import { loggedInPipeline } from "./pipelines";
import { listValidator } from "./utils";

export const productsList = createMethod({
  name: "products.list",
  schema: listValidator,
  async run(args): Promise<{ data: Product[]; total: number }> {
    const { filters, options } = args;

    const data = await Products.collection
      .createQuery({
        $filters: filters,
        $options: options,
        name: 1,
        type: 1,
        user: {
          emails: 1,
        },
        createdAt: 1,
      })
      .fetchAsync();

    const total = await Products.collection.find(filters).countAsync();

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
  }),
}).pipeline(loggedInPipeline, product => {
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

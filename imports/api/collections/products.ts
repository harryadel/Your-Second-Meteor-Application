import { Mongo } from "meteor/mongo";
import { z } from "zod";
import { hasDates, hasId, hasSoftDelete, hasUser } from "./utils";
import { ProductType } from "../types/products";

export const productInsertSchema = z.object({
  name: z.string(),
  type: z.nativeEnum(ProductType),
  categoryIds: z.array(z.string()).optional(),
});
type ProductInsert = z.infer<typeof productInsertSchema>;

export const productSchema = productInsertSchema
  .merge(hasId)
  .merge(hasDates)
  .merge(hasUser)
  .merge(hasSoftDelete)
  .merge(
    z.object({
      user: z
        .object({
          emails: z.array(z.object({ address: z.string() })),
        })
        .optional(),
    })
  );

export type Product = z.infer<typeof productSchema>;

/**
 * The StuffsCollection. It encapsulates state and variable values for stuff.
 */
class ProductsCollection {
  collection: Mongo.Collection<ProductInsert, Product>;

  constructor() {
    this.collection = new Mongo.Collection("products");

    this.collection.withSchema(productSchema);
    this.collection.withDates();
    this.collection.withUser();
    this.collection.withSoftDelete();
  }
}

/**
 * The singleton instance of the StuffsCollection.
 * @type {ProductsCollection}
 */
export const Products = new ProductsCollection();

import { Mongo } from "meteor/mongo";
import { z } from "zod";
import { hasDates, hasId, hasUser } from "./utils";
import { productInsertSchema } from "./schemas";

type ProductInsert = z.infer<typeof productInsertSchema>;

export const productSchema = productInsertSchema
  .merge(hasId)
  .merge(hasDates)
  .merge(hasUser)
  

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
  }
}

/**
 * The singleton instance of the StuffsCollection.
 * @type {ProductsCollection}
 */
export const Products = new ProductsCollection();

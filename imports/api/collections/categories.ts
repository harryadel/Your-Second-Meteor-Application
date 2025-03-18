import { Mongo } from "meteor/mongo";
import 'meteor/aldeed:collection2/static';
import { z } from "zod";
import { hasDates, hasId, hasUser } from "./utils";
import { categoryInsertSchema } from "./schemas";

type CategoryInsert = z.infer<typeof categoryInsertSchema>;

export const categorySchema = categoryInsertSchema
  .merge(hasId)
  .merge(hasDates)
  .merge(hasUser)
  

export type Category = z.infer<typeof categorySchema>;

/**
 * The StuffsCollection. It encapsulates state and variable values for stuff.
 */
class CategoriesCollection {
  collection: Mongo.Collection<CategoryInsert, Category>;

  constructor() {
    this.collection = new Mongo.Collection("categories");

    this.collection.attachSchema(categorySchema);
  }
}

/**
 * The singleton instance of the StuffsCollection.
 * @type {ProductsCollection}
 */
export const Categories = new CategoriesCollection();

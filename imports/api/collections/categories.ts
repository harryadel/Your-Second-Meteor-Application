import { Mongo } from "meteor/mongo";
import { z } from "zod";
import { hasDates, hasId, hasUser } from "./utils";

export const categoryInsertSchema = z.object({
  title: z.string(),
});
type CategoryInsert = z.infer<typeof categoryInsertSchema>;

export const categorySchema = categoryInsertSchema
  .merge(hasId)
  .merge(hasDates)
  .merge(hasUser)
  .merge(
    z.object({
      user: z
        .object({
          emails: z.array(z.object({ address: z.string() })),
        })
        .optional(),
    })
  );

export type Category = z.infer<typeof categorySchema>;

/**
 * The StuffsCollection. It encapsulates state and variable values for stuff.
 */
class CategoriesCollection {
  collection: Mongo.Collection<CategoryInsert, Category>;

  constructor() {
    this.collection = new Mongo.Collection("categories");

    this.collection.withSchema(categorySchema);
    this.collection.withDates();
    this.collection.withUser();
  }
}

/**
 * The singleton instance of the StuffsCollection.
 * @type {ProductsCollection}
 */
export const Categories = new CategoriesCollection();

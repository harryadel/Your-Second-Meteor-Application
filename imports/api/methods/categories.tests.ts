import { Meteor } from "meteor/meteor";
import { assert } from "chai";
import { Categories } from "../collections/categories";
import { categoriesAdd, categoriesDelete, categoriesList, categoriesSingle, categoriesUpdate } from "./categories";
import { resetDatabase } from "meteor/xolvio:cleaner";
import { Factory } from "meteor/dburles:factory";
import { Random } from "meteor/random";

if (Meteor.isServer) {
  describe("Categories", () => {
    beforeEach(() => {
      resetDatabase();
    });

    it("can add a new category", async () => {
      const categoryData = {
        title: "Test Category",
        type: "test",
      };

      const categoryId = await categoriesAdd.callAsync(categoryData);
      assert.isString(categoryId);

      const category = await Categories.collection.findOneAsync(categoryId);
      assert.equal(category?.title, categoryData.title);
      assert.equal(category?.type, categoryData.type);
    });

    it("can update a category", async () => {
      const categoryId = await Categories.collection.insertAsync({
        title: "Original Title",
        type: "original",
      });

      const updates = {
        id: categoryId,
        title: "Updated Title",
        type: "updated",
      };

      await categoriesUpdate.callAsync(updates);

      const category = await Categories.collection.findOneAsync(categoryId);
      assert.equal(category?.title, updates.title);
      assert.equal(category?.type, updates.type);
    });

    it("can delete a category", async () => {
      const categoryId = await Categories.collection.insertAsync({
        title: "To Delete",
        type: "delete",
      });

      await categoriesDelete.callAsync({ _id: categoryId });

      const category = await Categories.collection.findOneAsync(categoryId);
      assert.isNull(category);
    });

    it("can list categories", async () => {
      const categoryIds = await Promise.all([
        Categories.collection.insertAsync({ title: "Category 1", type: "type1" }),
        Categories.collection.insertAsync({ title: "Category 2", type: "type2" }),
      ]);

      const result = await categoriesList.callAsync({
        options: {},
      });

      assert.equal(result.total, 2);
      assert.equal(result.data.length, 2);
    });

    it("can get a single category", async () => {
      const categoryData = {
        title: "Single Category",
        type: "single",
      };

      const categoryId = await Categories.collection.insertAsync(categoryData);

      const category = await categoriesSingle.callAsync({ id: categoryId });
      assert.equal(category?.title, categoryData.title);
      assert.equal(category?.type, categoryData.type);
    });
  });
}

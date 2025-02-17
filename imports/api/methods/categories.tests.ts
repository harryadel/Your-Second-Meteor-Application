import { Meteor } from "meteor/meteor";
import assert from "assert";
import { Categories } from "../collections/categories";
import './categories.ts';

if (Meteor.isServer) {
  const userId = 'Km2Zr9XyW4uPnE5Dj';

  describe("Categories", () => {
    beforeEach(async () => {
      // Use rawCollection to bypass soft delete
      const rawCollection = Categories.collection.rawCollection();
      await rawCollection.deleteMany({});
    });

    it("can add a new category", async () => {
      const categoryData = {
        title: "Test Category",
      };

      const addMethod = Meteor.server.method_handlers['categories.add'];
      const categoryId = await addMethod.apply({ userId }, [categoryData]);
      assert.strictEqual(typeof categoryId, "string");

      const category = await Categories.collection.findOneAsync(categoryId);
      assert.ok(category);
      assert.strictEqual(category.title, categoryData.title);
    });

    it("can update a category", async () => {
      const categoryData = {
        title: "Test Category",
      };

      const addMethod = Meteor.server.method_handlers['categories.add'];
      const categoryId = await addMethod.apply({ userId }, [categoryData]);

      const updates = {
        id: categoryId,
        title: "Updated Title",
      };

      const updateMethod = Meteor.server.method_handlers['categories.update'];
      await updateMethod.apply({ userId }, [updates]);

      const category = await Categories.collection.findOneAsync(categoryId);
      assert.ok(category);
      assert.strictEqual(category.title, updates.title);
    });

    it("can delete a category", async () => {
      const categoryData = {
        title: "Test Category",
      };

      const addMethod = Meteor.server.method_handlers['categories.add'];
      const categoryId = await addMethod.apply({ userId }, [categoryData]);


      const deleteMethod = Meteor.server.method_handlers['categories.delete'];
      await deleteMethod.apply({ userId }, [{ _id: categoryId }]);

      const deletedCategory = await Categories.collection.findOneAsync(categoryId);
      assert.equal(deletedCategory.isDeleted, true);
      assert.ok(deletedCategory.deletedAt instanceof Date);
    });

    it("can list categories", async () => {
      const categories = [
        { title: 'Category 1' },
        { title: 'Category 2' }
      ];
      const addMethod = Meteor.server.method_handlers['categories.add'];
      // Insert products and store their IDs
      const categoryIds = await Promise.all(
        categories.map(category => addMethod.apply({ userId }, [category]))
      );


      const listMethod = Meteor.server.method_handlers['categories.list'];
      const result = await listMethod.apply({ userId }, [{ options: {} }]);
      assert.strictEqual(result.total, 2);
      assert.strictEqual(result.data.length, 2);
    });

    it("can get a single category", async () => {
      const categoryData = {
        title: "Test Category",
      };

      const addMethod = Meteor.server.method_handlers['categories.add'];
      const categoryId = await addMethod.apply({ userId }, [categoryData]);

      const singleMethod = Meteor.server.method_handlers['categories.single'];
      const category = await singleMethod.apply({ userId }, [{ id: categoryId }]);
      assert.ok(category);
      assert.strictEqual(category.title, categoryData.title);
    });
  });
}

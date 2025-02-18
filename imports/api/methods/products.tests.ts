import { Meteor } from 'meteor/meteor';
import assert from 'assert';
import { Products } from '/imports/api/collections/products';
import { Categories } from '/imports/api/collections/categories';
import { ProductType } from '/imports/api/types/products';
import './products.ts';

describe('products', () => {
  const userId = 'Km2Zr9XyW4uPnE5Dj';
  let productId: string;
  let categoryId: string;

  beforeEach(async () => {
    // Clean products collection
    const rawCollection = Products.collection.rawCollection();
    await rawCollection.deleteMany({});
    
    // Clean categories and create a test category
    const categoryCollection = Categories.collection.rawCollection();
    await categoryCollection.deleteMany({});
    categoryId = await Categories.collection.insertAsync({ 
      title: "Test Category",
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  it('should insert a new product', async ()=> {
    const product = {
      name: 'test-name',
      type: ProductType.Physical,
      categoryIds: [categoryId],
    };

    const addMethod = Meteor.server.method_handlers['products.add'];
    productId = await addMethod.apply({ userId }, [product]);
    assert.ok(productId);

    const foundProduct = await Products.collection.findOneAsync(productId);
    assert.ok(foundProduct);
    assert.strictEqual(foundProduct.name, product.name);
    assert.strictEqual(foundProduct.type, product.type);
    assert.deepStrictEqual(foundProduct.categoryIds, product.categoryIds);
  });

  it('should update a product', async ()=> {
    const product = {
      name: 'test-name',
      type: ProductType.Physical,
      categoryIds: [categoryId],
    };

    const addMethod = Meteor.server.method_handlers['products.add'];
    productId = await addMethod.apply({ userId }, [product]);
    assert.ok(productId);

    const newCategoryId = await Categories.collection.insertAsync({ 
      title: "Another Category",
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    const updates = {
      id: productId,
      name: 'updated-name',
      type: ProductType.Digital,
      categoryIds: [categoryId, newCategoryId],
    };

    const updateMethod = Meteor.server.method_handlers['products.update'];
    await updateMethod.apply({ userId }, [updates]);

    const foundProduct = await Products.collection.findOneAsync(productId);
    assert.ok(foundProduct);
    assert.strictEqual(foundProduct.name, updates.name);
    assert.strictEqual(foundProduct.type, updates.type);
    assert.deepStrictEqual(foundProduct.categoryIds, updates.categoryIds);
  });

  it('should delete a product', async ()=> {
    const product = {
      name: 'test-name',
      type: ProductType.Physical,
      categoryIds: [categoryId],
    };

    const addMethod = Meteor.server.method_handlers['products.add'];
    productId = await addMethod.apply({ userId }, [product]);
    assert.ok(productId);

    const deleteMethod = Meteor.server.method_handlers['products.delete'];
    await deleteMethod.apply({ userId }, [{ _id: productId }]);

    const foundProduct = await Products.collection.findOneAsync(productId);
    assert.strictEqual(foundProduct, undefined);
  });

  it('should list products with pagination and filtering', async () => {
    const addMethod = Meteor.server.method_handlers['products.add'];
    
    // Insert test products
    const products = [
      { name: 'product1', type: ProductType.Physical, categoryIds: [categoryId] },
      { name: 'product2', type: ProductType.Digital, categoryIds: [categoryId] },
      { name: 'product3', type: ProductType.Physical, categoryIds: [categoryId] }
    ];

    // Insert products and store their IDs
    const productIds = await Promise.all(
      products.map(product => addMethod.apply({ userId }, [product]))
    );

    // Test pagination
    const listMethod = Meteor.server.method_handlers['products.list'];
    let result = await listMethod.apply({ userId }, [{
      options: { limit: 2, skip: 0, sort: { field: 'name', direction: false } }  // false for ascending
    }]);

    // Verify pagination results
    assert.equal(result.data.length, 2);
    assert.equal(result.total, 3);

    // Test skip
    result = await listMethod.apply({ userId }, [{
      options: { limit: 2, skip: 2, sort: { field: 'name', direction: false } }  // false for ascending
    }]);

    assert.equal(result.data.length, 1);
    assert.equal(result.total, 3);

    // Test filtering by type
    result = await listMethod.apply({ userId }, [{
      filters: { type: [ProductType.Physical] },
      options: { sort: { field: 'name', direction: true } }
    }]);

    assert.equal(result.data.length, 2);
    assert.equal(result.total, 2);
    assert.equal(result.data[0].name, 'product1');
    assert.equal(result.data[1].name, 'product3');

    // Test filtering by category
    const newCategoryId = await Categories.collection.insertAsync({ 
      title: "New Category",
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const updateMethod = Meteor.server.method_handlers['products.update'];
    await updateMethod.apply({ userId }, [{ 
      id: productIds[0],
      name: 'product1',
      type: ProductType.Physical,
      categoryIds: [newCategoryId],
    }]);

    result = await listMethod.apply({ userId }, [{
      filters: { categoryIds: [newCategoryId] },
      options: { sort: { field: 'name', direction: true } }
    }]);

    assert.equal(result.data.length, 1);
    assert.equal(result.total, 1);
    assert.equal(result.data[0].name, 'product1');

    // Test that deleted items are not shown by default
    const deleteMethod = Meteor.server.method_handlers['products.delete'];
    await deleteMethod.apply({ userId }, [{ _id: productIds[0] }]);

    result = await listMethod.apply({ userId }, [{ options: {} }]);
    assert.equal(result.data.length, 2);
    assert.equal(result.total, 2);
    assert.equal(result.data[0].name, 'product2');
    assert.equal(result.data[1].name, 'product3');
  });
});
import { Meteor } from 'meteor/meteor';
import assert from 'assert';

import { Products } from '/imports/api/collections/products';
import './products.ts';

describe('products', function() {
  const userId = 'Km2Zr9XyW4uPnE5Dj';
  let productId: string;

  beforeEach(async function () {
    // Use rawCollection to bypass soft delete
    const rawCollection = Products.collection.rawCollection();
    await rawCollection.deleteMany({});
  });

  it('should insert a new product', async function(){
    let product = {
      name: 'test-name',
      type: 'test-type',
      userId,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    let method = Meteor.server.method_handlers['products.add'];
    
    productId = await method.apply({ userId }, [{name: product.name, type: product.type}]);

    let foundProduct = await Products.collection.findOneAsync(productId);
    
    assert.equal(foundProduct.name, product.name);
    assert.equal(foundProduct.type, product.type);
  });

  it('should delete a product', async function() {
    // First insert a product
    const product = { name: 'to-delete', type: 'test-type' };
    const addMethod = Meteor.server.method_handlers['products.add'];
    const _id = await addMethod.apply({ userId }, [product]);

    // Verify product exists
    let foundProduct = await Products.collection.findOneAsync(_id);
    assert.ok(foundProduct);
    assert.equal(foundProduct.isDeleted, false);

    // Delete the product
    const deleteMethod = Meteor.server.method_handlers['products.delete'];
    await deleteMethod.apply({ userId }, [{ _id }]);

    // Verify product is soft deleted
    foundProduct = await Products.collection.findOneAsync(_id);
    assert.ok(foundProduct);
    assert.equal(foundProduct.isDeleted, true);
    assert.ok(foundProduct.deletedAt instanceof Date);
  });

  it('should list products with pagination', async function() {
    // Insert test products
    const products = [
      { name: 'product1', type: 'type1' },
      { name: 'product2', type: 'type2' },
      { name: 'product3', type: 'type3' }
    ];

    // Insert products and store their IDs
    const productIds = [];
    for (const product of products) {
      const id = await Meteor.server.method_handlers['products.add'].apply({ userId }, [product]);
      productIds.push(id);
    }

    const method = Meteor.server.method_handlers['products.list'];
    
    // Test basic pagination
    let result = await method.apply({ userId }, [{
      filters: { isDeleted: false },
      options: {
        limit: 2,
        skip: 0,
        sort: {
          field: 'name',
          direction: true // ascending
        }
      }
    }]);

    // Verify pagination results
    assert.equal(result.data.length, 2);
    assert.equal(result.total, 3);
    assert.equal(result.data[0].name, 'product1');
    assert.equal(result.data[1].name, 'product2');

    // Test filtering
    result = await method.apply({ userId }, [{
      filters: { type: 'type1' },
      options: { sort: { field: 'name', direction: true } }
    }]);

    assert.equal(result.data.length, 1);
    assert.equal(result.total, 1);
    assert.equal(result.data[0].name, 'product1');

    // Test that deleted items are not shown by default
    const deleteMethod = Meteor.server.method_handlers['products.delete'];
    await deleteMethod.apply({ userId }, [{ _id: productIds[0] }]);

    result = await method.apply({ userId }, [{
      options: { sort: { field: 'name', direction: true } }
    }]);

    assert.equal(result.data.length, 2);
    assert.equal(result.total, 2);
    assert.equal(result.data[0].name, 'product2');
  });

});
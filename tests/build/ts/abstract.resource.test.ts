import { MockRestClient, RestClient } from '@apigames/rest-client';
import {
  ResourceContainer, ResourceObject,
} from '../../../lib';
import { Order } from './customer.order.resource';

describe('The base ', () => {
  describe('ResourceObject should throw ', () => {
    it('when the type property is queried.', () => {
      try {
        const container = new ResourceContainer();
        const resource = new ResourceObject(container);
        expect(resource.type).toBe('Expected the object to throw an error, but none was thrown.');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Method or Property not implemented.');
      }
    });

    it('when the attributes property is queried.', () => {
      try {
        const container = new ResourceContainer();
        const resource = new ResourceObject(container);
        expect(resource.attributes).toBe('Expected the object to throw an error, but none was thrown.');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Method or Property not implemented.');
      }
    });

    it('when the Delete() method is called.', async () => {
      try {
        const container = new ResourceContainer();
        const resource = new ResourceObject(container);
        await resource.Delete();
        expect(true).toBe('Expected the object to throw an error, but none was thrown.');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Method or Property not implemented.');
      }
    });
  });

  describe('ResourceObject should  ', () => {
    it('allow the id property to be set and queried.', () => {
      const container = new ResourceContainer();
      const resource = new ResourceObject(container);
      expect(resource.id).toBeUndefined();
      resource.id = 'abcdef1234';
      expect(resource.id).toBe('abcdef1234');
    });

    it('return an undefined uri if the object has not been deserialized from a valid resource object.', () => {
      const container = new ResourceContainer();
      const resource = new ResourceObject(container);
      expect(resource.uri).toBeUndefined();
    });
  });

  describe('ResourceContainer should throw ', () => {
    it('when the data property is queried.', () => {
      try {
        const container = new ResourceContainer();
        expect(container.data).toBe('Expected the object to throw an error, but none was thrown.');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Method or Property not implemented.');
      }
    });

    it('when the uri property is queried.', () => {
      try {
        const container = new ResourceContainer();
        expect(container.uri).toBe('Expected the object to throw an error, but none was thrown.');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Method or Property not implemented.');
      }
    });

    it('when the Add() method is called.', () => {
      try {
        const container = new ResourceContainer();
        container.Add();
        expect(true).toBe('Expected the object to throw an error, but none was thrown.');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Method or Property not implemented.');
      }
    });

    it('when the Delete() method is called.', async () => {
      try {
        const container = new ResourceContainer();
        const simpleResource = new Order(container);
        await container.Delete(simpleResource);
        expect(true).toBe('Expected the object to throw an error, but none was thrown.');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Method or Property not implemented.');
      }
    });

    it('when the Find() method is called.', async () => {
      try {
        const container = new ResourceContainer();
        await container.Find();
        expect(true).toBe('Expected the object to throw an error, but none was thrown.');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Method or Property not implemented.');
      }
    });

    it('when the Get() method is called.', async () => {
      try {
        const container = new ResourceContainer();
        await container.Get('id');
        expect(true).toBe('Expected the object to throw an error, but none was thrown.');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Method or Property not implemented.');
      }
    });

    it('when the IncludedObject() method is called.', () => {
      try {
        const container = new ResourceContainer();
        container.IncludedObject('type', 'id');
        expect(true).toBe('Expected the object to throw an error, but none was thrown.');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Method or Property not implemented.');
      }
    });
  });

  describe('ResourceContainer should  ', () => {
    it('return an automatically created rest client if no rest client is provided.', () => {
      const container = new ResourceContainer();
      expect(container.restClient).toBeDefined();
      expect(container.restClient).toBeInstanceOf(RestClient);
    });

    it('return an injected rest client if supplied to the constructor.', () => {
      const restClient = new MockRestClient();
      const container = new ResourceContainer(restClient);
      expect(container.restClient).toBe(restClient);
      expect(container.restClient).toBeInstanceOf(MockRestClient);
    });
  });
});

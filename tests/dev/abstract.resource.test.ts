import { MockRestClient, RestClient } from '@apigames/rest-client';
import { redactUndefinedValues } from '@apigames/json';
import {
  ResourceContainer, ResourceObject, ResourceObjectMode, ResourceObjectRelationship,
} from '../../src';
import { Order } from './customer.order.resource';

describe('The base ', () => {
  describe('ResourceObject should throw ', () => {
    it('when the type property is queried.', () => {
      try {
        const container = new ResourceContainer();
        const resource = new ResourceObject(container, ResourceObjectMode.NewDocument);
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
        const resource = new ResourceObject(container, ResourceObjectMode.NewDocument);
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
        const resource = new ResourceObject(container, ResourceObjectMode.NewDocument);
        await resource.Delete();
        expect(true).toBe('Expected the object to throw an error, but none was thrown.');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Method or Property not implemented.');
      }
    });
  });

  describe('ResourceObject should', () => {
    it('allow the id property to be set and queried.', () => {
      const container = new ResourceContainer();
      const resource = new ResourceObject(container, ResourceObjectMode.NewDocument);
      expect(resource.id).toBeUndefined();
      resource.id = 'abcdef1234';
      expect(resource.id).toBe('abcdef1234');
    });

    it('return an undefined uri if the object has not been deserialized from a valid resource object.', () => {
      const container = new ResourceContainer();
      const resource = new ResourceObject(container, ResourceObjectMode.NewDocument);
      expect(resource.uri).toBeUndefined();
    });

    describe('correctly calculates the patch attributes payload', () => {
      it('when both the shadow object and the current value are undefined', () => {
        const container = new ResourceContainer();
        const resource = new Order(container, ResourceObjectMode.ExistingDocument);
        const payload = resource.SerializeAttributesPayload(undefined, undefined);
        expect(payload).toBeUndefined();
      });

      it('when the shadow object does not exist, but the current value does', () => {
        const container = new ResourceContainer();
        const resource = new Order(container, ResourceObjectMode.ExistingDocument);
        const payload = resource.SerializeAttributesPayload(undefined, { name: 'value' });
        expect(payload).toEqual({ name: 'value' });
      });

      it('when the shadow object exists, but the current value does not', () => {
        const container = new ResourceContainer();
        const resource = new Order(container, ResourceObjectMode.ExistingDocument);
        const payload = resource.SerializeAttributesPayload({ name: 'value' }, undefined);
        expect(payload).toBeUndefined();
      });

      it('when the shadow object and the current object are equal', () => {
        const container = new ResourceContainer();
        const resource = new Order(container, ResourceObjectMode.ExistingDocument);
        const payload = resource.SerializeAttributesPayload({ name: 'value' }, { name: 'value' });
        expect(payload).toBeUndefined();
      });

      it('when a simple object contains one value that has changed', () => {
        const container = new ResourceContainer();
        const resource = new Order(container, ResourceObjectMode.ExistingDocument);
        const payload = resource.SerializeAttributesPayload({ name: 'value', count: 2 }, { name: 'value', count: 3 });
        expect(payload).toEqual({ count: 3 });
      });

      it('when a complex object contains multiple values that have changed', () => {
        const container = new ResourceContainer();
        const resource = new Order(container, ResourceObjectMode.ExistingDocument);
        const shadow: any = {
          name: 'value',
          count: 99,
          active: true,
          address: {
            line1: 'test1',
            line2: 'test3',
            line3: 'test4',
            city: 'Auckland',
            country: {
              code: 'NZ',
              name: 'New Zealand',
            },
            location: {
              latitude: -36.1292323,
              longitude: 174.12891829,
            },
            altLocation: {
              latitude: -36.1292323,
              longitude: 174.12891829,
            },
          },
          items: [1, 2, 3],
        };

        const current = {
          count: 99,
          active: false,
          address: {
            line1: 'test1',
            line2: 'test3',
            line3: 'test4',
            city: 'Sydney',
            country: {
              code: 'AU',
              name: 'Australia',
            },
            location: {
              latitude: -34.1292323,
              longitude: 174.12891829,
            },
          },
          items: [1, 3],
        };

        const payload = resource.SerializeAttributesPayload(shadow, current);
        redactUndefinedValues(payload);
        expect(payload).toEqual({
          name: null,
          active: false,
          address: {
            city: 'Sydney',
            country: {
              code: 'AU',
              name: 'Australia',
            },
            location: {
              latitude: -34.1292323,
              longitude: 174.12891829,
            },
            altLocation: null,
          },
          items: [1, 3],
        });
      });
    });

    describe('correctly calculates the patch relationships payload', () => {
      it('when both the shadow relationships and the current relationships are undefined', () => {
        const container = new ResourceContainer();
        const resource = new Order(container, ResourceObjectMode.ExistingDocument);
        const payload = resource.SerializeRelationshipsPayload(undefined, undefined);
        expect(payload).toBeUndefined();
      });

      it('when the shadow relationships does not exist, but the current relationships does', () => {
        const container = new ResourceContainer();
        const resource = new Order(container, ResourceObjectMode.ExistingDocument);

        const current = {
          target: new ResourceObjectRelationship(container.includes, 'Target', 'abc'),
        };

        const payload = resource.SerializeRelationshipsPayload(undefined, current);

        expect(payload).toEqual({
          target: {
            data: {
              type: 'Target',
              id: 'abc',
            },
          },
        });
      });

      it('when the shadow relationships exists, but the current relationships does not', () => {
        const container = new ResourceContainer();
        const resource = new Order(container, ResourceObjectMode.ExistingDocument);

        const shadow = {
          target: new ResourceObjectRelationship(container.includes, 'Target', 'abc'),
        };

        const payload = resource.SerializeRelationshipsPayload(shadow, undefined);
        expect(payload).toBeUndefined();
      });

      it('when the shadow relationships and the current relationships are equal', () => {
        const container = new ResourceContainer();
        const resource = new Order(container, ResourceObjectMode.ExistingDocument);

        const shadow = {
          target: new ResourceObjectRelationship(container.includes, 'Target', 'abc'),
        };

        const current = {
          target: new ResourceObjectRelationship(container.includes, 'Target', 'abc'),
        };

        const payload = resource.SerializeRelationshipsPayload(shadow, current);
        expect(payload).toBeUndefined();
      });

      it('when a single to one relationship has changed', () => {
        const container = new ResourceContainer();
        const resource = new Order(container, ResourceObjectMode.ExistingDocument);

        const shadow = {
          target1: new ResourceObjectRelationship(container.includes, 'Target1', 'abc1'),
          target2: new ResourceObjectRelationship(container.includes, 'Target2', 'abc2'),
          target3: new ResourceObjectRelationship(container.includes, 'Target3', 'abc3'),
        };

        const current = {
          target1: new ResourceObjectRelationship(container.includes, 'Target1', 'abc1'),
          target2: new ResourceObjectRelationship(container.includes, 'Target2', 'abc22'),
          target3: new ResourceObjectRelationship(container.includes, 'Target3', 'abc3'),
        };

        const payload = resource.SerializeRelationshipsPayload(shadow, current);
        expect(payload).toEqual({
          target2: {
            data: {
              type: 'Target2',
              id: 'abc22',
            },
          },
        });
      });

      it('when a single to many relationship has changed', () => {
        const container = new ResourceContainer();
        const resource = new Order(container, ResourceObjectMode.ExistingDocument);

        const shadow = {
          target1: [
            new ResourceObjectRelationship(container.includes, 'Target1', 'abc1'),
            new ResourceObjectRelationship(container.includes, 'Target1', 'abc2'),
            new ResourceObjectRelationship(container.includes, 'Target1', 'abc3'),
          ],
          target2: new ResourceObjectRelationship(container.includes, 'Target2', 'abc2'),
          target3: new ResourceObjectRelationship(container.includes, 'Target3', 'abc3'),
        };

        const current = {
          target1: [
            new ResourceObjectRelationship(container.includes, 'Target1', 'abc3'),
          ],
          target2: new ResourceObjectRelationship(container.includes, 'Target2', 'abc2'),
          target3: new ResourceObjectRelationship(container.includes, 'Target3', 'abc3'),
        };

        const payload = resource.SerializeRelationshipsPayload(shadow, current);
        expect(payload).toEqual({
          target1: {
            data: [
              {
                type: 'Target1',
                id: 'abc3',
              },
            ],
          },
        });
      });

      it('when a complex set of relationship changes have been made', () => {
        const container = new ResourceContainer();
        const resource = new Order(container, ResourceObjectMode.ExistingDocument);
        const shadow = {
          target1: [
            new ResourceObjectRelationship(container.includes, 'Target1', 'abc1'),
            new ResourceObjectRelationship(container.includes, 'Target1', 'abc2'),
            new ResourceObjectRelationship(container.includes, 'Target1', 'abc3'),
          ],
          target2: new ResourceObjectRelationship(container.includes, 'Target2', 'abc2'),
          target3: new ResourceObjectRelationship(container.includes, 'Target3', 'abc3'),
          target4: new ResourceObjectRelationship(container.includes, 'Target4', 'abc4'),
        };

        const current = {
          target1: [
            new ResourceObjectRelationship(container.includes, 'Target1', 'abc4'),
          ],
          target2: new ResourceObjectRelationship(container.includes, 'Target2', 'abc22'),
          target3: new ResourceObjectRelationship(container.includes, 'Target3', 'abc3'),
          target4: new ResourceObjectRelationship(container.includes, 'Target4', 'abc4'),
        };

        const payload = resource.SerializeRelationshipsPayload(shadow, current);
        redactUndefinedValues(payload);
        expect(payload).toEqual({
          target1: {
            data: [
              {
                type: 'Target1',
                id: 'abc4',
              },
            ],
          },
          target2: {
            data: {
              type: 'Target2',
              id: 'abc22',
            },
          },
        });
      });
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
        const simpleResource = new Order(container, ResourceObjectMode.ExistingDocument);
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

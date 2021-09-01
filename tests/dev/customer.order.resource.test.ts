import { MockRestClient, RestClientOptions } from '@apigames/rest-client';
import { CustomerOrders, IOrderAttributes, Order } from './customer.order.resource';
import { SDKException, SDKRequestException } from '../../src';

describe('The customer orders resource ', () => {
  describe('container\'s Add() method ', () => {
    it('should successfully create and initialize an order resource object.', () => {
      const customerOrders = new CustomerOrders('abc');
      const order = customerOrders.Add();
      expect(order).toBeDefined();
      expect(order).toBeInstanceOf(Order);
      expect(order.id).toBeUndefined();
    });
  });

  describe('container\'s Get() method ', () => {
    it('should throw an error when trying to load an object without the required type element.', async () => {
      const mockClient = new MockRestClient();
      jest.spyOn(mockClient, 'Get');
      mockClient.MockResolve({
        statusCode: 200,
        statusText: 'OK',
        headers: {
          'Content-Type': 'application/vnd.api+json',
        },
        data: {
          jsonapi: {
            version: '1.0',
          },
          data: {
            id: '69a56960-17d4-4f2f-bb2f-a671a6aa0fd9',
            attributes: {
              name: 'value',
            },
            links: {
              self: 'https://api.example.com/customers/9a383573-801f-4466-80b2-96f4fb93c384/orders/69a56960-17d4-4f2f-bb2f-a671a6aa0fd9',
            },
          },
          links: {
            self: 'https://api.example.com/customers/9a383573-801f-4466-80b2-96f4fb93c384/orders/69a56960-17d4-4f2f-bb2f-a671a6aa0fd9',
          },
        },
      });

      try {
        const customerOrders = new CustomerOrders('9a383573-801f-4466-80b2-96f4fb93c384', mockClient);
        await customerOrders.Get('69a56960-17d4-4f2f-bb2f-a671a6aa0fd9');
        expect(true).toBe('Expected the object to throw an error, but none was thrown.');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(SDKException);
        expect(error.code).toBe('INVALID-RESOURCE-TYPE');
        expect(error.message).toBe('The resource being loaded doesn\'t have the required resource type.');
      }
    });

    it('should throw an error when trying to load an object without the required id element.', async () => {
      const mockClient = new MockRestClient();
      jest.spyOn(mockClient, 'Get');
      mockClient.MockResolve({
        statusCode: 200,
        statusText: 'OK',
        headers: {
          'Content-Type': 'application/vnd.api+json',
        },
        data: {
          jsonapi: {
            version: '1.0',
          },
          data: {
            type: 'Order',
            attributes: {
              name: 'value',
            },
            links: {
              self: 'https://api.example.com/customers/9a383573-801f-4466-80b2-96f4fb93c384/orders/69a56960-17d4-4f2f-bb2f-a671a6aa0fd9',
            },
          },
          links: {
            self: 'https://api.example.com/customers/9a383573-801f-4466-80b2-96f4fb93c384/orders/69a56960-17d4-4f2f-bb2f-a671a6aa0fd9',
          },
        },
      });

      try {
        const customerOrders = new CustomerOrders('9a383573-801f-4466-80b2-96f4fb93c384', mockClient);
        await customerOrders.Get('69a56960-17d4-4f2f-bb2f-a671a6aa0fd9');
        expect(true).toBe('Expected the object to throw an error, but none was thrown.');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(SDKException);
        expect(error.code).toBe('INVALID-RESOURCE-ID');
        expect(error.message).toBe('The resource being loaded doesn\'t have the required resource id.');
      }
    });

    it('should throw errors returned by the API.', async () => {
      const mockClient = new MockRestClient();
      jest.spyOn(mockClient, 'Get');
      mockClient.MockResolve({
        statusCode: 404,
        statusText: 'NOT FOUND',
        headers: {
          'Content-Type': 'application/vnd.api+json',
        },
        data: {
          errors: [
            {
              code: '404-NOT-FOUND',
              title: 'The requested resource was not found.',
              status: 404,
            },
            {
              code: '405-STILL-NOT-FOUND',
              title: 'The requested resource was still not found.',
              status: 405,
            },
          ],
          jsonapi: {
            version: '1.0',
          },
          links: {
            self: 'https://api.example.com/customers/9a383573-801f-4466-80b2-96f4fb93c384/orders/69a56960-17d4-4f2f-bb2f-a671a6aa0fd9',
          },
        },
      });

      try {
        const customerOrders = new CustomerOrders('9a383573-801f-4466-80b2-96f4fb93c384', mockClient);
        await customerOrders.Get('69a56960-17d4-4f2f-bb2f-a671a6aa0fd9');
        expect(true).toBe('Expected the object to throw an error, but none was thrown.');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(SDKRequestException);
        expect(error.count).toBe(2);
        expect(error.status).toBe(400);
        expect(error.items[0].code).toBe('404-NOT-FOUND');
        expect(error.items[0].title).toBe('The requested resource was not found.');
        expect(error.items[0].status).toBe(404);
        expect(error.items[1].code).toBe('405-STILL-NOT-FOUND');
        expect(error.items[1].title).toBe('The requested resource was still not found.');
        expect(error.items[1].status).toBe(405);
      }
    });

    it('should clear the internal structures, get the resource and repopulate the internal data structures.', async () => {
      const mockClient = new MockRestClient();
      jest.spyOn(mockClient, 'Get');
      mockClient.MockResolve({
        statusCode: 200,
        statusText: 'OK',
        headers: {
          'Content-Type': 'application/vnd.api+json',
        },
        data: {
          jsonapi: {
            version: '1.0',
          },
          data: {
            type: 'Order',
            id: '69a56960-17d4-4f2f-bb2f-a671a6aa0fd9',
            attributes: {
              product: {
                code: 'WIN95',
                name: 'Windows 95',
                description: [
                  'Windows 95 was designed to be maximally compatible with existing MS-DOS and 16-bit Windows ',
                  'programs and device drivers while offering a more stable and better performing system. ',
                  'The Windows 95 architecture is an evolution of Windows for Workgroups\' 386 enhanced mode.',
                ],
              },
              qty: 1,
              price: 1.99,
            },
            links: {
              self: 'https://api.example.com/customers/9a383573-801f-4466-80b2-96f4fb93c384/orders/69a56960-17d4-4f2f-bb2f-a671a6aa0fd9',
            },
          },
          links: {
            self: 'https://api.example.com/customers/9a383573-801f-4466-80b2-96f4fb93c384/orders/69a56960-17d4-4f2f-bb2f-a671a6aa0fd9',
          },
        },
      });

      const customerOrders = new CustomerOrders('9a383573-801f-4466-80b2-96f4fb93c384', mockClient);
      const queryResult = await customerOrders.Get('69a56960-17d4-4f2f-bb2f-a671a6aa0fd9');

      const queryUri: string = 'https://api.example.com/customers/9a383573-801f-4466-80b2-96f4fb93c384/orders/'
        + '69a56960-17d4-4f2f-bb2f-a671a6aa0fd9';

      const queryHeaders = {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      };

      const queryOptions: RestClientOptions = {};

      const orderAttributes: IOrderAttributes = {
        product: {
          code: 'WIN95',
          name: 'Windows 95',
          description: [
            'Windows 95 was designed to be maximally compatible with existing MS-DOS and 16-bit Windows ',
            'programs and device drivers while offering a more stable and better performing system. ',
            'The Windows 95 architecture is an evolution of Windows for Workgroups\' 386 enhanced mode.',
          ],
        },
        qty: 1,
        price: 1.99,
      };

      expect(queryResult).toBe(true);
      expect(mockClient.Get).toHaveBeenCalledTimes(1);
      expect(mockClient.Get).toHaveBeenCalledWith(queryUri, queryHeaders, queryOptions);
      expect(customerOrders.data).toBeDefined();
      expect(customerOrders.data).toBeInstanceOf(Order);
      if (customerOrders.isResourceObject(customerOrders.data)) {
        expect(customerOrders.data.type).toBe('Order');
        expect(customerOrders.data.id).toBe('69a56960-17d4-4f2f-bb2f-a671a6aa0fd9');
        expect(customerOrders.data.attributes).toEqual(orderAttributes);
        expect(customerOrders.data.uri).toEqual('https://api.example.com/customers/9a383573-801f-4466-80b2-96f4fb93c384/orders/69a56960-17d4-4f2f-bb2f-a671a6aa0fd9');
      }
    });
  });

  it('should correctly format the uri when queried.', () => {
    const customerOrders = new CustomerOrders('9a383573-801f-4466-80b2-96f4fb93c384');
    expect(customerOrders.uri).toBe('https://api.example.com/customers/9a383573-801f-4466-80b2-96f4fb93c384/orders');
  });
});

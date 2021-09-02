import { MockRestClient, RestClientOptions } from '@apigames/rest-client';
import {
  CustomerOrders,
  Order,
  OrderAttributes,
  OrderFilter,
  OrderInclude,
  OrderSort,
} from './customer.order.resource';
import { SDKException, SDKRequestException } from '../../src';
import { ResourceFilterType } from '../../src/classes/resource.container';

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

    it('should throw an unexpected error received from the API.', async () => {
      const mockClient = new MockRestClient();
      jest.spyOn(mockClient, 'Get');
      mockClient.MockResolve({
        statusCode: 503,
        headers: {
          'Content-Type': 'application/vnd.api+json',
        },
      });

      try {
        const customerOrders = new CustomerOrders('9a383573-801f-4466-80b2-96f4fb93c384', mockClient);
        await customerOrders.Get('69a56960-17d4-4f2f-bb2f-a671a6aa0fd9');
        expect(true).toBe('Expected the object to throw an error, but none was thrown.');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(SDKRequestException);
        expect(error.count).toBe(1);
        expect(error.status).toBe(500);
        expect(error.items[0].code).toBe('UNEXPECTED-ERROR');
        expect(error.items[0].title).toBe('An unexpected error was received whilst processing the request.');
        expect(error.items[0].status).toBe(503);
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

      const orderAttributes: OrderAttributes = {
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

  describe('container\'s Find() method ', () => {
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
            self: 'https://api.example.com/customers/9a383573-801f-4466-80b2-96f4fb93c384/orders',
          },
        },
      });

      try {
        const customerOrders = new CustomerOrders('9a383573-801f-4466-80b2-96f4fb93c384', mockClient);
        await customerOrders.Find();
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
            self: 'https://api.example.com/customers/9a383573-801f-4466-80b2-96f4fb93c384/orders',
          },
        },
      });

      try {
        const customerOrders = new CustomerOrders('9a383573-801f-4466-80b2-96f4fb93c384', mockClient);
        await customerOrders.Find();
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
        statusCode: 400,
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
              code: '404-STILL-NOT-FOUND',
              title: 'The requested resource was still not found.',
              status: 404,
              detail: 'After an extensive look around the database, nothing resembling the desired resource was found.',
              source: {
                database: {
                  collections: 'all of them really',
                },
              },
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
        await customerOrders.Find();
        expect(true).toBe('Expected the object to throw an error, but none was thrown.');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(SDKRequestException);
        expect(error.count).toBe(2);
        expect(error.status).toBe(400);
        expect(error.items[0].code).toBe('404-NOT-FOUND');
        expect(error.items[0].title).toBe('The requested resource was not found.');
        expect(error.items[0].status).toBe(404);
        expect(error.items[1].code).toBe('404-STILL-NOT-FOUND');
        expect(error.items[1].title).toBe('The requested resource was still not found.');
        expect(error.items[1].status).toBe(404);
        expect(error.items[1].detail).toBe('After an extensive look around the database, nothing resembling '
          + 'the desired resource was found.');
        expect(error.items[1].source).toEqual({ database: { collections: 'all of them really' } });
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
          data: [
            {
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
                price: 1.95,
              },
              links: {
                self: 'https://api.example.com/customers/9a383573-801f-4466-80b2-96f4fb93c384/orders/69a56960-17d4-4f2f-bb2f-a671a6aa0fd9',
              },
            },
            {
              type: 'Order',
              id: '45801d5d-313e-4d40-be4f-c666b6f713c5',
              attributes: {
                product: {
                  code: 'WIN98',
                  name: 'Windows 98',
                  description: [
                    'Windows 98 is an operating system developed by Microsoft as part of its Windows 9x family of ',
                    'Microsoft Windows operating systems. It is the successor to Windows 95, and was released to ',
                    'manufacturing on May 15, 1998, and generally to retail on June 25, 1998.',
                  ],
                },
                qty: 1,
                price: 1.98,
              },
              links: {
                self: 'https://api.example.com/customers/9a383573-801f-4466-80b2-96f4fb93c384/orders/45801d5d-313e-4d40-be4f-c666b6f713c5',
              },
            },
          ],
          links: {
            self: 'https://api.example.com/customers/9a383573-801f-4466-80b2-96f4fb93c384/orders',
          },
        },
      });

      const customerOrders = new CustomerOrders('9a383573-801f-4466-80b2-96f4fb93c384', mockClient);
      await customerOrders.Filter(OrderFilter.ProductCode, ResourceFilterType.Equal, 'abc')
        .Sort(OrderSort.OrderDate)
        .Include(OrderInclude.Customer)
        .Page(2, 10)
        .Find();

      const queryUri: string = 'https://api.example.com/customers/9a383573-801f-4466-80b2-96f4fb93c384/orders';

      const queryHeaders = {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      };

      const queryOptions: RestClientOptions = {
        queryParams: {
          'filter[equal:product.code]': 'abc',
          sort: 'orderDate',
          include: 'customer',
          'page[number]': 2,
          'page[size]': 10,
        },
      };

      const windows95Attributes: OrderAttributes = {
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
        price: 1.95,
      };

      const windows98Attributes: OrderAttributes = {
        product: {
          code: 'WIN98',
          name: 'Windows 98',
          description: [
            'Windows 98 is an operating system developed by Microsoft as part of its Windows 9x family of ',
            'Microsoft Windows operating systems. It is the successor to Windows 95, and was released to ',
            'manufacturing on May 15, 1998, and generally to retail on June 25, 1998.',
          ],
        },
        qty: 1,
        price: 1.98,
      };

      expect(mockClient.Get).toHaveBeenCalledTimes(1);
      expect(mockClient.Get).toHaveBeenCalledWith(queryUri, queryHeaders, queryOptions);
      expect(customerOrders.data).toBeDefined();
      if (customerOrders.isResourceList(customerOrders.data)) {
        expect(customerOrders.data[0]).toBeInstanceOf(Order);
        expect(customerOrders.data[0].type).toBe('Order');
        expect(customerOrders.data[0].id).toBe('69a56960-17d4-4f2f-bb2f-a671a6aa0fd9');
        expect(customerOrders.data[0].attributes).toEqual(windows95Attributes);
        expect(customerOrders.data[0].uri).toEqual('https://api.example.com/customers/9a383573-801f-4466-80b2-96f4fb93c384/orders/69a56960-17d4-4f2f-bb2f-a671a6aa0fd9');
        expect(customerOrders.data[1]).toBeInstanceOf(Order);
        expect(customerOrders.data[1].type).toBe('Order');
        expect(customerOrders.data[1].id).toBe('45801d5d-313e-4d40-be4f-c666b6f713c5');
        expect(customerOrders.data[1].attributes).toEqual(windows98Attributes);
        expect(customerOrders.data[1].uri).toEqual('https://api.example.com/customers/9a383573-801f-4466-80b2-96f4fb93c384/orders/45801d5d-313e-4d40-be4f-c666b6f713c5');
      }
    });
  });

  describe('container\'s Delete() method ', () => {
    it('should throw errors returned by the API.', async () => {
      const mockClient = new MockRestClient();
      jest.spyOn(mockClient, 'Get');
      jest.spyOn(mockClient, 'Delete');

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
        if (customerOrders.isResourceObject(customerOrders.data)) await customerOrders.Delete(customerOrders.data);
        expect(true).toBe('Expected the object to throw an error, but none was thrown.');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(SDKRequestException);
        expect(error.count).toBe(1);
        expect(error.status).toBe(400);
        expect(error.items[0].code).toBe('404-NOT-FOUND');
        expect(error.items[0].title).toBe('The requested resource was not found.');
        expect(error.items[0].status).toBe(404);
      }
    });

    it('should remove the single object from the container if the delete is successful.', async () => {
      const mockClient = new MockRestClient();
      jest.spyOn(mockClient, 'Get');
      jest.spyOn(mockClient, 'Delete');
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
      mockClient.MockResolve({
        statusCode: 204,
        statusText: 'OK',
        headers: {
          'Content-Type': 'application/vnd.api+json',
        },
      });

      const customerOrders = new CustomerOrders('9a383573-801f-4466-80b2-96f4fb93c384', mockClient);
      await customerOrders.Get('69a56960-17d4-4f2f-bb2f-a671a6aa0fd9');

      expect(customerOrders.data).toBeDefined();
      expect(customerOrders.data).toBeInstanceOf(Order);

      if (customerOrders.isResourceObject(customerOrders.data)) await customerOrders.Delete(customerOrders.data);

      expect(customerOrders.data).toBeUndefined();
    });

    it('should remove the object from the object list in the container if the delete is successful.', async () => {
      const mockClient = new MockRestClient();
      jest.spyOn(mockClient, 'Get');
      jest.spyOn(mockClient, 'Delete');

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
          data: [
            {
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
                price: 1.95,
              },
              links: {
                self: 'https://api.example.com/customers/9a383573-801f-4466-80b2-96f4fb93c384/orders/69a56960-17d4-4f2f-bb2f-a671a6aa0fd9',
              },
            },
            {
              type: 'Order',
              id: '45801d5d-313e-4d40-be4f-c666b6f713c5',
              attributes: {
                product: {
                  code: 'WIN98',
                  name: 'Windows 98',
                  description: [
                    'Windows 98 is an operating system developed by Microsoft as part of its Windows 9x family of ',
                    'Microsoft Windows operating systems. It is the successor to Windows 95, and was released to ',
                    'manufacturing on May 15, 1998, and generally to retail on June 25, 1998.',
                  ],
                },
                qty: 1,
                price: 1.98,
              },
              links: {
                self: 'https://api.example.com/customers/9a383573-801f-4466-80b2-96f4fb93c384/orders/45801d5d-313e-4d40-be4f-c666b6f713c5',
              },
            },
          ],
          links: {
            self: 'https://api.example.com/customers/9a383573-801f-4466-80b2-96f4fb93c384/orders',
          },
        },
      });

      mockClient.MockResolve({
        statusCode: 204,
        statusText: 'OK',
        headers: {
          'Content-Type': 'application/vnd.api+json',
        },
      });

      const customerOrders = new CustomerOrders('9a383573-801f-4466-80b2-96f4fb93c384', mockClient);
      await customerOrders.Find();

      expect(customerOrders.data).toBeDefined();
      if (customerOrders.isResourceList(customerOrders.data)) {
        expect(customerOrders.data.length).toBe(2);
        expect(customerOrders.data[0].id).toBe('69a56960-17d4-4f2f-bb2f-a671a6aa0fd9');
        if (customerOrders.isResourceList(customerOrders.data)) await customerOrders.data[0].Delete();
        expect(customerOrders.data.length).toBe(1);
        expect(customerOrders.data[0].id).toBe('45801d5d-313e-4d40-be4f-c666b6f713c5');
      }
    });
  });

  describe('container\'s Save() method ', () => {
    it('should throw an error if the API returns an error during the operation.', async () => {
      const mockClient = new MockRestClient();
      jest.spyOn(mockClient, 'Post');
      mockClient.MockResolve({
        statusCode: 400,
        statusText: 'Conflict',
        headers: {
          'Content-Type': 'application/vnd.api+json',
        },
        data: {
          errors: [
            {
              code: '409-CONFLICT',
              title: 'A conflict occurred.',
              status: 409,
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

      const customerOrders = new CustomerOrders('9a383573-801f-4466-80b2-96f4fb93c384', mockClient);
      const order = customerOrders.Add();
      order.attributes.product = {
        code: 'PRODUCT-CODE',
        name: 'PRODUCT-NAME',
      };
      order.attributes.qty = 5;
      order.attributes.price = 12.98;

      try {
        expect(order.id).toBeUndefined();
        await order.Save();
        expect(true).toBe('Expected the object to throw an error, but none was thrown.');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(SDKRequestException);
        expect(error.count).toBe(1);
        expect(error.status).toBe(400);
        expect(error.items[0].code).toBe('409-CONFLICT');
        expect(error.items[0].title).toBe('A conflict occurred.');
        expect(error.items[0].status).toBe(409);
      }
    });

    it('should POST a new resource to the API and add it to the internal data structures.', async () => {
      const mockClient = new MockRestClient();
      jest.spyOn(mockClient, 'Post');
      mockClient.MockResolve({
        statusCode: 201,
        statusText: 'OK',
        headers: {
          'Content-Type': 'application/vnd.api+json',
          location: 'https://api.example.com/customers/9a383573-801f-4466-80b2-96f4fb93c384/orders/69a56960-17d4-4f2f-bb2f-a671a6aa0fd9',
        },
      });

      const customerOrders = new CustomerOrders('9a383573-801f-4466-80b2-96f4fb93c384', mockClient);
      const order = customerOrders.Add();
      order.attributes.product = {
        code: 'PRODUCT-CODE',
        name: 'PRODUCT-NAME',
      };
      order.attributes.qty = 5;
      order.attributes.price = 12.98;

      expect(order.id).toBeUndefined();
      await order.Save();

      const queryUri = 'https://api.example.com/customers/9a383573-801f-4466-80b2-96f4fb93c384/orders';
      const queryHeaders = {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      };
      const queryOptions: RestClientOptions = {};
      const queryPayload = {
        data: {
          type: 'Order',
          attributes: {
            product: {
              code: 'PRODUCT-CODE',
              name: 'PRODUCT-NAME',
            },
            qty: 5,
            price: 12.98,
          },
        },
      };

      expect(mockClient.Post).toHaveBeenCalledTimes(1);
      expect(mockClient.Post).toHaveBeenCalledWith(queryUri, queryPayload, queryHeaders, queryOptions);

      expect(customerOrders.data).toBeDefined();
      expect(customerOrders.data).toBeInstanceOf(Order);
      expect(customerOrders.data).toBe(order);
      expect(order.id).toBeDefined();
      expect(order.id).toBe('69a56960-17d4-4f2f-bb2f-a671a6aa0fd9');
    });
  });

  it('should correctly format the uri when queried.', () => {
    const customerOrders = new CustomerOrders('9a383573-801f-4466-80b2-96f4fb93c384');
    expect(customerOrders.uri).toBe('https://api.example.com/customers/9a383573-801f-4466-80b2-96f4fb93c384/orders');
  });
});

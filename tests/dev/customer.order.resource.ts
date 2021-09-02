// eslint-disable-next-line max-classes-per-file
import { IRestClient } from '@apigames/rest-client';
import { isDefined } from '@apigames/json';
import {
  IResourceContainer,
  IResourceObjectAttributes,
  ResourceContainer,
  ResourceFilterValue,
  ResourceObject,
  SDKConfig,
} from '../../src';
import { ResourceFilterType } from '../../src/classes/resource.container';

// eslint-disable-next-line no-shadow
export enum OrderFilter {
  ProductCode = 'product.code',
}

// eslint-disable-next-line no-shadow
export enum OrderSort {
  OrderDate = 'orderDate',
}

// eslint-disable-next-line no-shadow
export enum OrderInclude {
  Customer = 'customer',
}

export class OrderAttributes implements IResourceObjectAttributes {
  product?: {
    code?: string;
    name?: string;
    description?: string[];
  };

  qty?: number;

  price?: number;
}

export class Order extends ResourceObject {
  private _attributes: OrderAttributes;

  constructor(container: IResourceContainer) {
    super(container);
    this._attributes = new OrderAttributes();
  }

  protected LoadAttributes(value: any) {
    this._attributes = value;
  }

  get attributes(): OrderAttributes {
    return this._attributes;
  }

  // eslint-disable-next-line class-methods-use-this
  get type(): string {
    return 'Order';
  }
}

export class CustomerOrders extends ResourceContainer {
  constructor(customerId: string, restClient?: IRestClient) {
    super(restClient);
    this.pathParams.customerId = customerId;
  }

  get data(): Order | Order[] {
    if (isDefined(this._data) && this.isResourceObject(this._data)) {
      return this._data as Order;
    }

    if (isDefined(this._data) && this.isResourceList(this._data)) {
      return this._data as Order[];
    }

    return undefined;
  }

  Add(): Order {
    const obj = new Order(this);
    this.AddResource(obj);
    return obj;
  }

  // eslint-disable-next-line class-methods-use-this,no-unused-vars
  Filter(filter: OrderFilter, selector: ResourceFilterType, value: ResourceFilterValue): IResourceContainer {
    return super.Filter(OrderFilter.ProductCode, selector, value);
  }

  // eslint-disable-next-line class-methods-use-this,no-unused-vars
  Sort(option: OrderSort): IResourceContainer {
    return super.Sort(OrderSort.OrderDate);
  }

  // eslint-disable-next-line class-methods-use-this,no-unused-vars
  Include(include: OrderInclude): IResourceContainer {
    return super.Include(OrderInclude.Customer);
  }

  // eslint-disable-next-line class-methods-use-this
  protected EndpointPath(): string {
    return 'https://api.example.com/customers/{customerId}/orders';
  }
}

SDKConfig().RegisterResourceClass('Order', Order);

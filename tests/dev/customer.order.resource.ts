// eslint-disable-next-line max-classes-per-file
import { IRestClient } from '@apigames/rest-client';
import { isDefined } from '@apigames/json';
import {
  IResourceObjectAttributes,
  ResourceContainer,
  ResourceObject,
  SDKConfig,
} from '../../src';

export interface IOrderAttributes extends IResourceObjectAttributes {
  product: {
    code: string;
    name: string;
    description: string[];
  };
  qty: number;
  price: number;
}

export class Order extends ResourceObject {
  private _attributes: IOrderAttributes;

  protected DeserializeAttributes(value: any) {
    this._attributes = value;
  }

  get attributes(): IOrderAttributes {
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
    return new Order(this);
  }

  // eslint-disable-next-line class-methods-use-this
  protected EndpointPath(): string {
    return 'https://api.example.com/customers/{customerId}/orders';
  }
}

SDKConfig().RegisterResourceClass('Order', Order);

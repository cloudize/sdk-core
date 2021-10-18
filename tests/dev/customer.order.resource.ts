// eslint-disable-next-line max-classes-per-file
import { IRestClient } from '@apigames/rest-client';
import { hasProperty, isArray, isDefined } from '@apigames/json';
import {
  IResourceContainer,
  IResourceObjectAttributes,
  IResourceObjectRelationships,
  ResourceContainer,
  ResourceFilterType,
  ResourceFilterValue,
  ResourceObject,
  ResourceObjectAttributeBase,
  ResourceObjectRelationship,
  ResourceObjectRelationshipBase,
  SDKConfig,
} from '../../src';

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

export class OrderProductUsageDetailsHome extends ResourceObjectAttributeBase implements IResourceObjectAttributes {
  family?: string;

  LoadData(data: any): void {
    this.family = data.family;
  }
}

export class OrderProductUsageDetailsWork extends ResourceObjectAttributeBase implements IResourceObjectAttributes {
  companyName?: string;

  LoadData(data: any): void {
    this.companyName = data.companyName;
  }
}

export class OrderProductFeature extends ResourceObjectAttributeBase implements IResourceObjectAttributes {
  name?: string;

  userRating?: number;

  LoadData(data: any): void {
    this.name = data.name;
    this.userRating = data.userRating;
  }
}

export class OrderAttributes extends ResourceObjectAttributeBase implements IResourceObjectAttributes {
  product?: {
    code?: string;
    name?: string;
    description?: string[];
    releaseDate?: Date,
    usageDetails?: OrderProductUsageDetailsHome | OrderProductUsageDetailsWork,
    features?: OrderProductFeature[]
  };

  qty?: number;

  price?: number;

  private static LoadProductDescription(data: any): string[] {
    const values: string[] = [];

    if (isArray(data)) {
      // eslint-disable-next-line no-restricted-syntax
      for (const value of data) {
        values.push(value);
      }
    }

    return values;
  }

  private static isOrderProductUsageDetailsHome(data: any): data is OrderProductUsageDetailsHome {
    return isDefined(data) && (hasProperty(data, 'family'));
  }

  private static isOrderProductUsageDetailsWork(data: any): data is OrderProductUsageDetailsHome {
    return isDefined(data) && (hasProperty(data, 'companyName'));
  }

  private static LoadProductUsageDetails(data: any): OrderProductUsageDetailsHome | OrderProductUsageDetailsWork {
    if (OrderAttributes.isOrderProductUsageDetailsHome(data)) {
      const productUsageDetails = new OrderProductUsageDetailsHome();
      productUsageDetails.LoadData(data);
      return productUsageDetails;
    }

    if (OrderAttributes.isOrderProductUsageDetailsWork(data)) {
      const productUsageDetails = new OrderProductUsageDetailsWork();
      productUsageDetails.LoadData(data);
      return productUsageDetails;
    }

    return undefined;
  }

  private static LoadProductFeatures(data: any): OrderProductFeature[] {
    const values: OrderProductFeature[] = [];

    if (isArray(data)) {
      // eslint-disable-next-line no-restricted-syntax
      for (const value of data) {
        const productFeature = new OrderProductFeature();
        productFeature.LoadData(value);
        values.push(productFeature);
      }
    }

    return values;
  }

  LoadData(data: any): void {
    this.product = {
      code: data.product?.code,
      name: data.product?.name,
      description: OrderAttributes.LoadProductDescription(data.product?.description),
      releaseDate: OrderAttributes.LoadDateTime(data.product?.releaseDate),
      usageDetails: OrderAttributes.LoadProductUsageDetails(data.product?.usageDetails),
      features: OrderAttributes.LoadProductFeatures(data.product?.features),
    };

    this.qty = data.qty;
    this.price = data.price;
  }
}

export class OrderRelationships extends ResourceObjectRelationshipBase implements IResourceObjectRelationships {
  customer?: ResourceObjectRelationship;

  LoadData(data: any): void {
    this.customer = OrderRelationships.LoadRelationshipObject(data.customer);
  }
}

export class Order extends ResourceObject {
  private current: {
    attributes: OrderAttributes;
    relationships: OrderRelationships;
  };

  private shadow: {
    attributes: OrderAttributes;
    relationships: OrderRelationships;
  };

  constructor(container: IResourceContainer) {
    super(container);
    this.current = {
      attributes: new OrderAttributes(),
      relationships: new OrderRelationships(),
    };
    this.shadow = {
      attributes: new OrderAttributes(),
      relationships: new OrderRelationships(),
    };
  }

  protected LoadAttributes(data: any) {
    this.current.attributes.LoadData(data);
    this.shadow.attributes.LoadData(data);
  }

  protected LoadRelationships(data: any) {
    this.current.relationships.LoadData(data);
    this.shadow.relationships.LoadData(data);
  }

  get attributes(): OrderAttributes {
    return this.current.attributes;
  }

  get relationships(): OrderRelationships {
    return this.current.relationships;
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
    this.AddResourceToMemoryStructure(obj);
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

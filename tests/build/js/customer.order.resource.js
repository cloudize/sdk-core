// eslint-disable-next-line max-classes-per-file
const { hasProperty, isArray, isDefined } = require('@apigames/json');
const {
  ResourceContainer,
  ResourceObject,
  ResourceObjectAttributeBase,
  ResourceObjectRelationshipBase,
  SDKConfig,
} = require('../../../lib');

const OrderFilterProductCode = 'product.code';
const OrderSortOrderDate = 'orderDate';
const OrderIncludeCustomer = 'customer';

class OrderProductUsageDetailsHome extends ResourceObjectAttributeBase {
  family;

  LoadData(data) {
    this.family = data.family;
  }
}

class OrderProductUsageDetailsWork extends ResourceObjectAttributeBase {
  companyName;

  LoadData(data) {
    this.companyName = data.companyName;
  }
}

class OrderProductFeature extends ResourceObjectAttributeBase {
  name;

  userRating;

  LoadData(data) {
    this.name = data.name;
    this.userRating = data.userRating;
  }
}

class OrderAttributes extends ResourceObjectAttributeBase {
  product;

  qty;

  price;

  static LoadProductDescription(data) {
    const values = [];

    if (isArray(data)) {
      // eslint-disable-next-line no-restricted-syntax
      for (const value of data) {
        values.push(value);
      }
    }

    return values;
  }

  static isOrderProductUsageDetailsHome(data) {
    return isDefined(data) && (hasProperty(data, 'family'));
  }

  static isOrderProductUsageDetailsWork(data) {
    return isDefined(data) && (hasProperty(data, 'companyName'));
  }

  static LoadProductUsageDetails(data) {
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

  static LoadProductFeatures(data) {
    const values = [];

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

  LoadData(data) {
    this.product = {
      code: data.product?.code,
      name: data.product?.name,
      description: OrderAttributes.LoadProductDescription(data.product?.description),
      releaseDate: OrderAttributes.LoadDateTime(data.product?.releaseDate),
      releaseLocation: OrderAttributes.LoadGeospatialPoint(data.product?.releaseLocation),
      usageDetails: OrderAttributes.LoadProductUsageDetails(data.product?.usageDetails),
      features: OrderAttributes.LoadProductFeatures(data.product?.features),
    };

    this.qty = data.qty;
    this.price = data.price;
  }
}

class OrderRelationships extends ResourceObjectRelationshipBase {
  customer;

  LoadData(data) {
    this.customer = OrderRelationships.LoadRelationshipObject(data.customer);
  }
}

class Order extends ResourceObject {
  current;

  shadow;

  constructor(container) {
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

  // eslint-disable-next-line class-methods-use-this
  EndpointContentType() {
    return 'application/vnd.api+json';
  }

  LoadAttributes(data) {
    this.current.attributes.LoadData(data);
    this.shadow.attributes.LoadData(data);
  }

  LoadRelationships(data) {
    this.current.relationships.LoadData(data);
    this.shadow.relationships.LoadData(data);
  }

  get attributes() {
    return this.current.attributes;
  }

  get relationships() {
    return this.current.relationships;
  }

  // eslint-disable-next-line class-methods-use-this
  get type() {
    return 'Order';
  }
}

class CustomerOrders extends ResourceContainer {
  constructor(customerId, restClient) {
    super(restClient);
    this.pathParams.customerId = customerId;
  }

  get data() {
    if (isDefined(this._data) && this.isResourceObject(this._data)) {
      return this._data;
    }

    if (isDefined(this._data) && this.isResourceList(this._data)) {
      return this._data;
    }

    return undefined;
  }

  Add() {
    const obj = new Order(this);
    this.AddResourceToMemoryStructure(obj);
    return obj;
  }

  // eslint-disable-next-line class-methods-use-this,no-unused-vars
  Filter(filter, selector, value) {
    return super.Filter(OrderFilterProductCode, selector, value);
  }

  // eslint-disable-next-line class-methods-use-this,no-unused-vars
  Sort(option) {
    return super.Sort(OrderSortOrderDate);
  }

  // eslint-disable-next-line class-methods-use-this,no-unused-vars
  Include(include) {
    return super.Include(OrderIncludeCustomer);
  }

  // eslint-disable-next-line class-methods-use-this
  EndpointPath() {
    return 'https://api.example.com/customers/{customerId}/orders';
  }

  // eslint-disable-next-line class-methods-use-this
  EndpointContentType() {
    return 'application/vnd.api+json';
  }
}

SDKConfig().RegisterResourceClass('Order', Order);

module.exports = {
  CustomerOrders,
  Order,
  OrderFilterProductCode,
  OrderIncludeCustomer,
  OrderSortOrderDate,
};

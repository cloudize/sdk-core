import { isResourceContainer, isResourceObject } from '../../../lib';
import { CustomerOrders, Order } from './customer.order.resource';
import { ResourceObjectMode } from '../../../lib/classes/resource.object';

describe('The resource object type guard ', () => {
  it('should return false for an undefined value', () => {
    expect(isResourceObject(undefined)).toBe(false);
  });

  it('should return false for a null value', () => {
    expect(isResourceObject(null)).toBe(false);
  });

  it('should return false for a numeric value', () => {
    expect(isResourceObject(100)).toBe(false);
  });

  it('should return false for an invalid object', () => {
    expect(isResourceObject(new CustomerOrders('test'))).toBe(false);
  });

  it('should return true for a valid object', () => {
    expect(isResourceObject(new Order(new CustomerOrders('test'), ResourceObjectMode.NewDocument))).toBe(true);
  });
});

describe('The resource container type guard ', () => {
  it('should return false for an undefined value', () => {
    expect(isResourceContainer(undefined)).toBe(false);
  });

  it('should return false for a null value', () => {
    expect(isResourceContainer(null)).toBe(false);
  });

  it('should return false for a numeric value', () => {
    expect(isResourceContainer(100)).toBe(false);
  });

  it('should return false for an invalid object', () => {
    expect(isResourceContainer(new Order(new CustomerOrders('test'), ResourceObjectMode.NewDocument))).toBe(false);
  });

  it('should return true for a valid object', () => {
    expect(isResourceContainer(new CustomerOrders('test'))).toBe(true);
  });
});

import { isDefinedAndNotNull } from '@apigames/json';
import { ResourceContainer, ResourceObject } from '../classes';

export function isResourceContainer(value: any): value is ResourceContainer {
  return isDefinedAndNotNull(value) && (value instanceof ResourceContainer);
}

export function isResourceObject(value: any): value is ResourceObject {
  return isDefinedAndNotNull(value)
      && (value instanceof ResourceObject)
      && (typeof value.type === 'string');
}

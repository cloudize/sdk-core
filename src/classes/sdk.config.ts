import { isUndefined } from '@apigames/json';
import { ResourceObjectClass } from './resource.object';

export type SDKResourceMap = {
  [index: string] :ResourceObjectClass;
}

export class SDKConfiguration {
  private _resourceMap: SDKResourceMap;

  constructor() {
    this._resourceMap = {};
  }

  RegisterResourceClass(type: string, resourceClass: ResourceObjectClass) {
    this._resourceMap[type] = resourceClass;
  }

  ResourceClass(type: string): ResourceObjectClass {
    return this._resourceMap[type];
  }
}

let configInstance: SDKConfiguration;

export function SDKConfig(): SDKConfiguration {
  if (isUndefined(configInstance)) configInstance = new SDKConfiguration();
  return configInstance;
}

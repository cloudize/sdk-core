import {
  hasProperty, isArray, isDefined, isEmpty, isNumber, isObject, isString,
} from '@apigames/json';
import {
  IRestClient, RestClient, RestClientOptions, RestClientResponse,
} from '@apigames/rest-client';
import { redactUndefinedValues } from '@apigames/json/lib/utils';
import {
  IResourceContainer,
  IResourceObject,
  ResourceFilterName,
  ResourceFilterValue,
  ResourceIncludeOption,
  ResourceSortOption,
  ResourcePathParams, SDKConfig, ResourceObjectClass, SDKException, SDKRequestException,
} from '..';

type ResourceContainerQueryParams = {
  includes: {
    [index: string]: boolean;
  };
  filters: {
    [index: string]: string;
  };
  sort: string;
  pagination: {
    page?: number,
    size?: number,
  };
}

export enum ResourceFilterType {
  Equal = 'equal',
}

export default class ResourceContainer implements IResourceContainer {
  protected _data: IResourceObject | IResourceObject[];

  private _queryParams: ResourceContainerQueryParams;

  private _restClient: IRestClient;

  protected pathParams: ResourcePathParams;

  constructor(restClient?: IRestClient) {
    this._data = undefined;
    this._restClient = isDefined(restClient) ? restClient : new RestClient();
    this.pathParams = {};
    this._queryParams = {
      includes: {},
      filters: {},
      sort: undefined,
      pagination: {},
    };
  }

  // eslint-disable-next-line class-methods-use-this
  get data(): IResourceObject | IResourceObject[] {
    throw new Error('Method or Property not implemented.');
  }

  get restClient(): IRestClient {
    return this._restClient;
  }

  get uri(): string {
    let uriPath = this.EndpointPath();

    // eslint-disable-next-line no-restricted-syntax
    for (const pathParam in this.pathParams) {
      if (hasProperty(this.pathParams, pathParam)) {
        uriPath = uriPath.replace(`{${pathParam}}`, this.pathParams[pathParam]);
      }
    }

    return uriPath;
  }

  // eslint-disable-next-line class-methods-use-this
  protected EndpointPath(): string {
    throw new Error('Method or Property not implemented.');
  }

  protected ClearData() {
    this._data = undefined;
  }

  // eslint-disable-next-line class-methods-use-this
  isResourceObject(value: any): value is IResourceObject {
    return isObject(value);
  }

  // eslint-disable-next-line class-methods-use-this
  isResourceList(value: any): value is IResourceObject[] {
    return isArray(value);
  }

  protected LoadResourceData(resourceData: any): IResourceObject {
    if (hasProperty(resourceData, 'type') && isString(resourceData.type)) {
      if (hasProperty(resourceData, 'id') && isString(resourceData.id)) {
        const ResourceClass: ResourceObjectClass = SDKConfig().ResourceClass(resourceData.type);
        return new ResourceClass(this).LoadData(resourceData);
      }

      throw new SDKException('INVALID-RESOURCE-ID', 'The resource being loaded doesn\'t have the required resource id.');
    }

    throw new SDKException('INVALID-RESOURCE-TYPE', 'The resource being loaded doesn\'t have the required resource type.');
  }

  protected LoadResponse(response: RestClientResponse) {
    this.ClearData();

    if (hasProperty(response.data, 'data')) {
      if (isArray(response.data.data)) {
        this._data = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const resource of response.data.data) {
          this._data.push(this.LoadResourceData(resource));
        }
      } else if (isObject(response.data.data)) {
        this._data = this.LoadResourceData(response.data.data);
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this,no-unused-vars
  protected LoadErrors(response: RestClientResponse) {
    this.ClearData();

    if (hasProperty(response.data, 'errors') && isArray(response.data.errors)) {
      const requestException = new SDKRequestException();

      // eslint-disable-next-line no-restricted-syntax
      for (const error of response.data.errors) {
        if (hasProperty(error, 'code') && isString(error.code)
            && hasProperty(error, 'title') && isString(error.title)
            && hasProperty(error, 'status') && isNumber(error.status)) {
          let detail: string;
          if (hasProperty(error, 'detail') && isString(error.detail)) detail = error.detail;

          let source: any;
          if (hasProperty(error, 'source')) source = error.source;

          requestException.AddError(error.code, error.title, error.status, detail, source);
        }
      }

      throw requestException;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  Add(): IResourceObject {
    throw new Error('Method or Property not implemented.');
  }

  // eslint-disable-next-line class-methods-use-this,no-unused-vars
  Delete(resource: IResourceObject): Promise<void> {
    throw new Error('Method or Property not implemented.');
  }

  // eslint-disable-next-line class-methods-use-this
  async Find(): Promise<void> {
    this.ClearData();
    const queryUri: string = `${this.uri}`;
    const queryHeaders = {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    };
    const queryOptions: RestClientOptions = {
      queryParams: this.GetQueryParams(),
    };

    this.ClearQueryParams();
    redactUndefinedValues(queryOptions);

    const response = await this._restClient.Get(queryUri, queryHeaders, queryOptions);

    switch (response.statusCode) {
      case 200:
        this.LoadResponse(response);
        break;
      default:
        this.LoadErrors(response);
        break;
    }
  }

  async Get(id: string): Promise<boolean> {
    this.ClearData();
    const queryUri: string = `${this.uri}/${id}`;
    const queryHeaders = {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    };
    const queryOptions: RestClientOptions = {
      queryParams: this.GetQueryParams(),
    };

    this.ClearQueryParams();
    redactUndefinedValues(queryOptions);

    const response = await this._restClient.Get(queryUri, queryHeaders, queryOptions);
    switch (response.statusCode) {
      case 200:
        this.LoadResponse(response);
        return true;
      default:
        this.LoadErrors(response);
        return false;
    }
  }

  private ClearQueryParams() {
    this._queryParams = {
      includes: {},
      filters: {},
      sort: undefined,
      pagination: {},
    };
  }

  private GetQueryParams():any {
    const queryParams: any = {};

    // eslint-disable-next-line no-restricted-syntax
    for (const filterName in this._queryParams.filters) {
      if (hasProperty(this._queryParams.filters, filterName)) {
        queryParams[`filter[${filterName}]`] = this._queryParams.filters[filterName];
      }
    }

    const includeList: string[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const includeName in this._queryParams.includes) {
      if (hasProperty(this._queryParams.includes, includeName)) {
        includeList.push(includeName);
      }
    }
    if (includeList.length > 0) queryParams.include = includeList.join(',');

    if (hasProperty(this._queryParams.pagination, 'page')) queryParams['page[number]'] = this._queryParams.pagination.page;
    if (hasProperty(this._queryParams.pagination, 'page')) queryParams['page[size]'] = this._queryParams.pagination.size;

    if (isDefined(this._queryParams.sort)) queryParams.sort = this._queryParams.sort;

    if (isEmpty(queryParams)) return undefined;

    return queryParams;
  }

  // eslint-disable-next-line class-methods-use-this,no-unused-vars
  IncludedObject(type: string, id: string): IResourceObject {
    throw new Error('Method or Property not implemented.');
  }

  // eslint-disable-next-line class-methods-use-this,no-unused-vars
  Filter(filter: ResourceFilterName, selector: ResourceFilterType, value: ResourceFilterValue): IResourceContainer {
    this._queryParams.filters[`${selector}:${filter}`] = value;
    return this;
  }

  // eslint-disable-next-line class-methods-use-this,no-unused-vars
  Sort(option: ResourceSortOption): IResourceContainer {
    this._queryParams.sort = option;
    return this;
  }

  // eslint-disable-next-line class-methods-use-this,no-unused-vars
  Include(include: ResourceIncludeOption): IResourceContainer {
    this._queryParams.includes[include] = true;
    return this;
  }

  // eslint-disable-next-line class-methods-use-this,no-unused-vars
  Page(pageNumber: number, pageSize: number): IResourceContainer {
    this._queryParams.pagination.page = pageNumber;
    this._queryParams.pagination.size = pageSize;
    return this;
  }
}

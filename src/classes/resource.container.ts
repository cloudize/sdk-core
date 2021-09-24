import {
  extractAndRedact,
  hasProperty, isArray, isDefined, isDefinedAndNotNull, isEmpty, isNumber, isObject, isString, isUndefinedOrNull,
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
  ResourceObjectClass,
  ResourcePathParams,
  ResourceSortOption,
  SDKConfig,
  SDKException,
} from '..';

const hash = require('object-hash');

type ResourceContainerQueryParams = {
  includes: {
    [index: string]: boolean;
  };
  filters: {
    [index: string]: string;
  };
  sort: string;
  pagination: {
    offset?: number,
    page?: number,
    size?: number,
  };
}

// eslint-disable-next-line no-shadow
export enum ResourceFilterType {
  Equal = 'equal',
  NotEqual = '!equal',
  From = 'from',
  To = 'to',
  AutoComplete = 'autocomplete',
  TextSearch = 'text',
  NearLocation = 'near',
  Exists = 'exists',
}

export default class ResourceContainer implements IResourceContainer {
  private _count: number;

  private _countQueryHash: string;

  protected _data: IResourceObject | IResourceObject[];

  private _queryParams: ResourceContainerQueryParams;

  private readonly _restClient: IRestClient;

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
  isResourceObject(value: any): value is IResourceObject {
    return isObject(value);
  }

  // eslint-disable-next-line class-methods-use-this
  isResourceList(value: any): value is IResourceObject[] {
    return isArray(value);
  }

  // eslint-disable-next-line class-methods-use-this
  protected EndpointPath(): string {
    throw new Error('Method or Property not implemented.');
  }

  protected ClearData() {
    this._data = undefined;
  }

  protected AddResourceToMemoryStructure(obj: IResourceObject) {
    if (isDefined(this.data)) {
      if (this.isResourceObject(this.data)) {
        const currentObj = this.data;
        this._data = [currentObj];
      }
      if (this.isResourceList(this.data)) {
        this.data.push(obj);
      }
    } else {
      this._data = obj;
    }
  }

  private RemoveResourceFromMemoryStructure(resource: IResourceObject) {
    if (this.isResourceList(this.data)) {
      this.data.forEach((item, index) => {
        if (this.isResourceList(this.data) && (item.id === resource.id)) this.data.splice(index, 1);
      });
    } else if (this.isResourceObject(this.data) && this.data.id === resource.id) {
      this._data = undefined;
    }
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
          this.AddResourceToMemoryStructure(this.LoadResourceData(resource));
        }
      } else if (isObject(response.data.data)) {
        this.AddResourceToMemoryStructure(this.LoadResourceData(response.data.data));
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  Add(): IResourceObject {
    throw new Error('Method or Property not implemented.');
  }

  // eslint-disable-next-line class-methods-use-this,no-unused-vars
  async Delete(resource: IResourceObject): Promise<void> {
    if (isDefined(resource.id)) {
      const queryUri: string = `${this.uri}/${resource.id}`;
      const queryHeaders = {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      };
      const queryOptions: RestClientOptions = {
        queryParams: this.GetQueryParams(),
      };

      this.InitParams();
      redactUndefinedValues(queryOptions);

      await this._restClient.Delete(queryUri, queryHeaders, queryOptions);
      this.RemoveResourceFromMemoryStructure(resource);
    } else {
      this.RemoveResourceFromMemoryStructure(resource);
    }
  }

  async Count(): Promise<number> {
    const queryUri: string = `${this.uri}`;
    const queryHeaders = {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    };
    const queryOptions: RestClientOptions = {
      queryParams: this.GetQueryParams(),
    };

    if (isDefinedAndNotNull(queryOptions.queryParams)) {
      extractAndRedact(queryOptions.queryParams, 'include');
      extractAndRedact(queryOptions.queryParams, 'page[number]');
      extractAndRedact(queryOptions.queryParams, 'page[offset]');
      extractAndRedact(queryOptions.queryParams, 'page[size]');
      extractAndRedact(queryOptions.queryParams, 'sort');
    }

    redactUndefinedValues(queryOptions);

    const queryParams = {
      uri: queryUri,
      headers: queryHeaders,
      queryOptions,
    };

    const queryHash = hash(queryParams);
    if (isDefinedAndNotNull(this._countQueryHash) && (this._countQueryHash === queryHash) && isDefinedAndNotNull(this._count)) {
      return this._count;
    }

    if (isUndefinedOrNull(queryOptions.queryParams)) queryOptions.queryParams = {};
    queryOptions.queryParams['meta-action'] = 'count';

    const response = await this._restClient.Get(queryUri, queryHeaders, queryOptions);

    if (hasProperty(response, 'data') && hasProperty(response.data, 'meta')
      && hasProperty(response.data.meta, 'count') && isNumber(response.data.meta.count)) {
      this._count = response.data.meta.count;
      this._countQueryHash = queryHash;
      return this._count;
    }

    throw new SDKException('COUNT-FAILED', 'The request to count the number of resources related '
          + 'to this query was unsuccessful.');
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

    this.InitParams();
    redactUndefinedValues(queryOptions);

    this.LoadResponse(await this._restClient.Get(queryUri, queryHeaders, queryOptions));
  }

  async Get(id: string): Promise<void> {
    this.ClearData();
    const queryUri: string = `${this.uri}/${id}`;
    const queryHeaders = {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    };
    const queryOptions: RestClientOptions = {
      queryParams: this.GetQueryParams(),
    };

    this.InitParams();
    redactUndefinedValues(queryOptions);
    this.LoadResponse(await this._restClient.Get(queryUri, queryHeaders, queryOptions));
  }

  private InitParams() {
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

    if (hasProperty(this._queryParams.pagination, 'offset')) queryParams['page[offset]'] = this._queryParams.pagination.offset;
    if (hasProperty(this._queryParams.pagination, 'page')) queryParams['page[number]'] = this._queryParams.pagination.page;
    if (hasProperty(this._queryParams.pagination, 'size')) queryParams['page[size]'] = this._queryParams.pagination.size;

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

  PageOffset(pageOffset: number, pageSize: number): IResourceContainer {
    this._queryParams.pagination.offset = pageOffset;
    this._queryParams.pagination.size = pageSize;
    return this;
  }

  PageNumber(pageNumber: number, pageSize: number): IResourceContainer {
    this._queryParams.pagination.page = pageNumber;
    this._queryParams.pagination.size = pageSize;
    return this;
  }
}

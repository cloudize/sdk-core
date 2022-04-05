import {
  areEqual,
  hasProperty, isArray, isDefined, isNumber, isObject, isString, isUndefined, redactUndefinedValues,
} from '@apigames/json';
import { RestClientOptions, RestClientResponseHeaders } from '@apigames/rest-client';
import {
  IResourceContainer,
  IResourceObject,
  IResourceObjectAttributes,
  IResourceObjectRelationships,
  ResourceObjectUri, SDKConfig,
  SDKException,
} from '..';

// eslint-disable-next-line no-shadow
export enum ResourceObjectMode {
    NewDocument,
    ExistingDocument
}

export default class ResourceObject implements IResourceObject {
  private _container: IResourceContainer;

  private _id: string;

  private _mode: ResourceObjectMode = ResourceObjectMode.NewDocument;

  private _uri: ResourceObjectUri;

  constructor(container: IResourceContainer) {
    this._container = container;
  }

  // eslint-disable-next-line class-methods-use-this
  protected EndpointContentType(): string {
    throw new Error('Method or Property not implemented.');
  }

  // eslint-disable-next-line class-methods-use-this,no-unused-vars
  protected LoadAttributes(value: any) {
    throw new Error('Method or Property not implemented.');
  }

  // eslint-disable-next-line class-methods-use-this,no-unused-vars
  protected LoadRelationships(value: any) {
    throw new Error('Method or Property not implemented.');
  }

  // eslint-disable-next-line class-methods-use-this,no-unused-vars
  public UpdateAttributes(value: any) {
    throw new Error('Method or Property not implemented.');
  }

  // eslint-disable-next-line class-methods-use-this,no-unused-vars
  public UpdateRelationships(value: any) {
    throw new Error('Method or Property not implemented.');
  }

  LoadData(value: any): IResourceObject {
    if (!hasProperty(value, 'type') || (value.type !== this.type)) {
      throw new SDKException('INVALID-RESOURCE-MAPPING', 'The resource data being loaded cannot be '
          + 'read into this object');
    }

    if (hasProperty(value, 'id')) this._id = value.id;

    if (hasProperty(value, 'attributes')) this.LoadAttributes(value.attributes);

    if (hasProperty(value, 'relationships')) this.LoadRelationships(value.relationships);

    if (hasProperty(value, 'links') && isObject(value.links) && hasProperty(value.links, 'self')
        && isString(value.links.self)) {
      this._uri = value.links.self;
    }

    this._mode = ResourceObjectMode.ExistingDocument;

    return this;
  }

  protected GetInsertPayload(): any {
    const payload: any = {
      data: {
        type: this.type,
      },
    };

    if (isDefined(this.id)) payload.data.id = this.id;
    if (isDefined(this.attributes)) payload.data.attributes = this.attributes;
    if (isDefined(this.relationships)) payload.data.relationships = this.relationships;

    return payload;
  }

  protected GeneratePatchAttributesPayload(shadow: any, data: any): any {
    if (areEqual(shadow, data)) return undefined;
    if (isUndefined(data) && isUndefined(shadow)) return undefined;

    if (isArray(data)) return data;

    if (isObject(data)) {
      if ((Object.keys(data).length === 2)
          && (hasProperty(data, 'latitude') && isNumber(data.latitude))
          && (hasProperty(data, 'longitude') && isNumber(data.longitude))) {
        return data;
      }

      const payload: any = {};
      // eslint-disable-next-line no-restricted-syntax
      for (const fieldName in data) {
        if (hasProperty(data, fieldName)) {
          if (isDefined(shadow)) payload[fieldName] = this.GeneratePatchAttributesPayload(shadow[fieldName], data[fieldName]);
          else payload[fieldName] = this.GeneratePatchAttributesPayload(undefined, data[fieldName]);
        }
      }

      if (isDefined(shadow) && isObject(shadow)) {
        // eslint-disable-next-line no-restricted-syntax
        for (const fieldName in shadow) {
          if (hasProperty(shadow, fieldName)) {
            if (isUndefined(data[fieldName])) payload[fieldName] = null;
          }
        }
      }

      return payload;
    }

    return data;
  }

  // eslint-disable-next-line class-methods-use-this
  protected GeneratePatchRelationshipsPayload(shadow: any, data: any): any {
    if (areEqual(shadow, data)) return undefined;
    if (isUndefined(data) && isUndefined(shadow)) return undefined;

    if (isObject(data)) {
      const payload: any = {};
      // eslint-disable-next-line no-restricted-syntax
      for (const fieldName in data) {
        if (hasProperty(data, fieldName)) {
          if (isUndefined(shadow) || !areEqual(shadow[fieldName], data[fieldName])) payload[fieldName] = data[fieldName];
        }
      }

      if (isDefined(shadow) && isObject(shadow)) {
        // eslint-disable-next-line no-restricted-syntax
        for (const fieldName in shadow) {
          if (hasProperty(shadow, fieldName)) {
            if (isUndefined(data[fieldName])) payload[fieldName] = null;
          }
        }
      }

      return payload;
    }

    return data;
  }

  protected GetUpdatePayload(): any {
    const payload: any = {
      data: {
        type: this.type,
        id: this.id,
      },
    };

    if (isDefined(this.attributes)) {
      payload.data.attributes = this.GeneratePatchAttributesPayload(this.shadowAttributes, this.attributes);
    }

    if (isDefined(this.relationships)) {
      payload.data.relationships = this.GeneratePatchRelationshipsPayload(this.shadowRelationships, this.relationships);
    }

    redactUndefinedValues(payload);
    return payload;
  }

  async Delete(): Promise<void> {
    await this._container.Delete(this);
  }

  // eslint-disable-next-line class-methods-use-this
  private GetHeaderValue(headers: RestClientResponseHeaders, targetHeader: string): string {
    let value: string;

    // eslint-disable-next-line no-restricted-syntax
    for (const headerName in headers) {
      if (headerName.toLowerCase() === targetHeader.toLowerCase()) {
        value = headers[headerName];
      }
    }

    return value;
  }

  private GetHeaders(): any {
    const headers: any = {
      Accept: this.EndpointContentType(),
      'Content-Type': this.EndpointContentType(),
    };

    if (isDefined(SDKConfig().apiKey)) {
      headers['x-api-key'] = SDKConfig().apiKey;
    }

    if (isDefined(SDKConfig().accessToken)) {
      headers.Authorization = `Bearer ${SDKConfig().accessToken}`;
    }

    return headers;
  }

  // eslint-disable-next-line class-methods-use-this
  private HasHeader(headers: RestClientResponseHeaders, targetHeader: string): boolean {
    let hasHeader = false;

    // eslint-disable-next-line no-restricted-syntax
    for (const headerName in headers) {
      if (headerName.toLowerCase() === targetHeader.toLowerCase()) {
        hasHeader = true;
      }
    }

    return hasHeader;
  }

  private async InsertResource() {
    const queryUri: string = this._container.uri;
    const queryHeaders = this.GetHeaders();
    const queryOptions: RestClientOptions = {};
    const payload: any = this.GetInsertPayload();

    const response = await this._container.restClient.Post(queryUri, payload, queryHeaders, queryOptions);

    if (!this.HasHeader(response.headers, 'location')) {
      throw new SDKException('INVALID-LOCATION', 'The save operation was unable to retrieve the location '
              + 'of the resource created by the API.');
    }

    if (!this.HasHeader(response.headers, 'x-api-resource-id')) {
      throw new SDKException('INVALID-RESOURCE-ID', 'The save operation was unable to retrieve the '
          + 'identifier of the resource created by the API.');
    }

    this.id = this.GetHeaderValue(response.headers, 'x-api-resource-id');
    this._uri = this.GetHeaderValue(response.headers, 'location');
    this._mode = ResourceObjectMode.ExistingDocument;
  }

  private async UpdateResource() {
    const queryUri: string = this.uri;
    const queryHeaders = this.GetHeaders();
    const queryOptions: RestClientOptions = {};
    const payload: any = this.GetUpdatePayload();

    await this._container.restClient.Patch(queryUri, payload, queryHeaders, queryOptions);
  }

  // eslint-disable-next-line class-methods-use-this
  async Save() {
    if (this._mode === ResourceObjectMode.NewDocument) {
      await this.InsertResource();
    } else {
      await this.UpdateResource();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  get type(): string {
    throw new Error('Method or Property not implemented.');
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  // eslint-disable-next-line class-methods-use-this
  get attributes(): IResourceObjectAttributes {
    throw new Error('Method or Property not implemented.');
  }

  // eslint-disable-next-line class-methods-use-this
  get relationships(): IResourceObjectRelationships {
    throw new Error('Method or Property not implemented.');
  }

  // eslint-disable-next-line class-methods-use-this
  protected get shadowAttributes(): IResourceObjectAttributes {
    throw new Error('Method or Property not implemented.');
  }

  // eslint-disable-next-line class-methods-use-this
  protected get shadowRelationships(): IResourceObjectRelationships {
    throw new Error('Method or Property not implemented.');
  }

  get uri(): ResourceObjectUri {
    return this._uri;
  }
}

export type ResourceObjectClass = typeof ResourceObject;

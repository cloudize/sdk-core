import {
  hasProperty, isArray, isDefined, isNumber, isObject, isString, isUndefined,
} from '@apigames/json';
import { RestClientOptions, RestClientResponse } from '@apigames/rest-client';
import { redactUndefinedValues } from '@apigames/json/lib/utils';
import {
  IResourceContainer,
  IResourceObject,
  IResourceObjectAttributes,
  ResourceObjectUri,
  SDKException, SDKRequestException,
} from '..';

export default class ResourceObject implements IResourceObject {
    private _container: IResourceContainer;

    private _id: string;

    private _uri: ResourceObjectUri;

    constructor(container: IResourceContainer) {
      this._container = container;
    }

    // eslint-disable-next-line class-methods-use-this,no-unused-vars
    protected LoadAttributes(value: any) {
      throw new Error('Method or Property not implemented.');
    }

    // eslint-disable-next-line class-methods-use-this,no-unused-vars
    protected LoadRelationships(value: any) {
      throw new Error('Method or Property not implemented.');
    }

    LoadData(value: any): IResourceObject {
      if (!hasProperty(value, 'type') || (value.type !== this.type)) {
        throw new SDKException('INVALID-RESOURCE-MAPPING', 'The resource being loaded cannot be read into this object');
      }

      if (hasProperty(value, 'id')) this._id = value.id;

      if (hasProperty(value, 'attributes')) this.LoadAttributes(value.attributes);

      if (hasProperty(value, 'relationships')) this.LoadRelationships(value.relationships);

      if (hasProperty(value, 'links') && isObject(value.links) && hasProperty(value.links, 'self')
        && isString(value.links.self)) {
        this._uri = value.links.self;
      }

      return this;
    }

    protected GetInsertPayload(): any {
      const payload: any = {
        data: {
          type: this.type,
        },
      };

      if (isDefined(this.attributes)) payload.data.attributes = this.attributes;

      return payload;
    }

    // eslint-disable-next-line class-methods-use-this,no-unused-vars
    protected LoadErrors(response: RestClientResponse) {
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
      } else {
        const error = new SDKRequestException();
        error.AddError('UNEXPECTED-ERROR', 'An unexpected error was received whilst processing the request.',
          response.statusCode);
        throw error;
      }
    }

    async Delete(): Promise<void> {
      await this._container.Delete(this);
    }

    private async InsertResource() {
      const queryUri: string = this._container.uri;
      const queryHeaders = {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      };
      const queryOptions: RestClientOptions = {};
      const payload: any = this.GetInsertPayload();

      const response = await this._container.restClient.Post(queryUri, payload, queryHeaders, queryOptions);
      switch (response.statusCode) {
        case 201:
          if (hasProperty(response.headers, 'location')) {
            const headers: any = response.headers;
            const pathParts = headers.location.split('/');
            this.id = pathParts.pop();
          } else {
            const exception = new SDKRequestException();
            exception.AddError('INVALID-LOCATION', 'The save operation was unable to retrieve the id of the '
              + 'resource from the API.', 201);
            throw exception;
          }
          break;
        default:
          this.LoadErrors(response);
      }
    }

    private async UpdateResource() {
      throw new Error('Method or Property not implemented.');
    }

    // eslint-disable-next-line class-methods-use-this
    async Save() {
      if (isUndefined(this._id)) {
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

    get uri(): ResourceObjectUri {
      return this._uri;
    }
}

export type ResourceObjectClass = typeof ResourceObject;

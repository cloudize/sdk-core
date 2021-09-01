import { hasProperty, isObject, isString } from '@apigames/json';
import {
  IResourceContainer,
  IResourceObject,
  IResourceObjectAttributes,
  ResourceObjectUri,
  SDKException,
} from '..';

export default class ResourceObject implements IResourceObject {
    private _container: IResourceContainer;

    private _id: string;

    private _uri: ResourceObjectUri;

    constructor(container: IResourceContainer) {
      this._container = container;
    }

    // eslint-disable-next-line class-methods-use-this,no-unused-vars
    protected DeserializeAttributes(value: any) {
      throw new Error('Method not implemented.');
    }

    // eslint-disable-next-line class-methods-use-this,no-unused-vars
    protected DeserializeRelationships(value: any) {
      throw new Error('Method not implemented.');
    }

    Deserialize(value: any): IResourceObject {
      if (!hasProperty(value, 'type') || (value.type !== this.type)) {
        throw new SDKException('INVALID-RESOURCE-MAPPING', 'The resource being loaded cannot be read into this object');
      }

      if (hasProperty(value, 'id')) this._id = value.id;

      if (hasProperty(value, 'attributes')) this.DeserializeAttributes(value.attributes);

      if (hasProperty(value, 'relationships')) this.DeserializeRelationships(value.relationships);

      if (hasProperty(value, 'links') && isObject(value.links) && hasProperty(value.links, 'self')
        && isString(value.links.self)) {
        this._uri = value.links.self;
      }

      return this;
    }

    async Delete(): Promise<void> {
      await this._container.Delete(this);
    }

    // eslint-disable-next-line class-methods-use-this
    async Save() {
      throw new Error('Method not implemented.');
    }

    // eslint-disable-next-line class-methods-use-this
    get type(): string {
      throw new Error('Property not implemented.');
    }

    get id(): string {
      return this._id;
    }

    set id(value: string) {
      this._id = value;
    }

    // eslint-disable-next-line class-methods-use-this
    get attributes(): IResourceObjectAttributes {
      throw new Error('Property not implemented.');
    }

    get uri(): ResourceObjectUri {
      return this._uri;
    }
}

export type ResourceObjectClass = typeof ResourceObject;

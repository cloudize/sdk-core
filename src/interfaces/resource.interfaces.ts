// eslint-disable-next-line max-classes-per-file
import {
  hasProperty, isDefined, isObject, isString,
} from '@apigames/json';
import { IRestClient } from '@apigames/rest-client';
import {
  LoadDateTime as LoadDateTimeHelper,
  LoadGeospatialPoint as LoadGeospatialPointHelper,
} from '../helpers';
import { ResourceFilterType } from '../classes';

export type ResourceObjectType = string;
export type ResourceObjectIdentifier = string;

// eslint-disable-next-line no-shadow
export enum ResourceObjectAttributesLoadType {
    Replace,
    Update,
}

export interface IResourceObjectAttributes {
    LoadData(data: any, action: ResourceObjectAttributesLoadType): void;
}

export type ResourceObjectRelationshipLinkObject = {
    type: ResourceObjectType;
    id: ResourceObjectIdentifier;
}

export type ResourceObjectRelationshipLink = {
    data: ResourceObjectRelationshipLinkObject;
}

export type ResourceObjectRelationshipsLinks = {
    data: ResourceObjectRelationshipLinkObject[];
};

export type ResourceContainerIncludedResources = {
    // eslint-disable-next-line no-use-before-define
    [id: string]: IResourceObject;
}

export type ResourceContainerIncludedResourceTypes = {
    [type: string]: ResourceContainerIncludedResources;
}

export class ResourceObjectRelationship {
  private _includes: ResourceContainerIncludedResourceTypes;

  type: ResourceObjectType;

  id: ResourceObjectIdentifier;

  constructor(includes: ResourceContainerIncludedResourceTypes, type: ResourceObjectType, id?: ResourceObjectIdentifier) {
    this._includes = includes;
    this.type = type;
    if (id) this.id = id;
  }

  // eslint-disable-next-line no-use-before-define
  get target(): IResourceObject {
    if (isDefined(this.type) && isDefined(this.id) && isDefined(this._includes[this.type][this.id])) {
      return this._includes[this.type][this.id];
    }

    return undefined;
  }
}

export type ResourceObjectRelationships = ResourceObjectRelationship[];

// eslint-disable-next-line no-shadow
export enum ResourceObjectRelationshipsLoadType {
    Replace,
    Update,
}

export interface IResourceObjectRelationships {
    LoadData(data: any, action: ResourceObjectRelationshipsLoadType): void;
}

export type ResourceObjectUri = string;

export class ResourceObjectAttributeBase {
  protected static LoadDateTime(value: string): Date {
    return LoadDateTimeHelper(value);
  }

  // eslint-disable-next-line no-use-before-define
  protected static LoadGeospatialPoint(value: any): GeospatialPoint {
    return LoadGeospatialPointHelper(value);
  }
}

export class GeospatialPoint extends ResourceObjectAttributeBase implements IResourceObjectAttributes {
  longitude: number;

  latitude: number;

  LoadData(data: any) {
    this.longitude = data.longitude;
    this.latitude = data.latitude;
  }
}

export class ResourceObjectRelationshipBase {
  private _includes: ResourceContainerIncludedResourceTypes;

  constructor(includes: ResourceContainerIncludedResourceTypes) {
    this._includes = includes;
  }

  protected LoadRelationshipData(expectedType: string, value: any): ResourceObjectRelationship {
    if (isDefined(value) && (hasProperty(value, 'data') && isObject(value.data)
        && hasProperty(value.data, 'type') && isString(value.data.type)
        && (value.data.type === expectedType)
        && hasProperty(value.data, 'id') && isString(value.data.id)
    )) return new ResourceObjectRelationship(this._includes, value.data.type, value.data.id);

    return undefined;
  }

  // eslint-disable-next-line no-unused-vars
  static RelationshipType(relationshipName: string): string {
    throw new Error('Method or Property not implemented.');
  }
}

export interface IResourceObject {
    type: ResourceObjectType;
    id?: ResourceObjectIdentifier;
    attributes: IResourceObjectAttributes
    relationships: IResourceObjectRelationships;
    uri: ResourceObjectUri;
    LoadData(value: any): IResourceObject;
    Delete(): Promise<void>;
    Save(): Promise<void>;
    UpdateAttributes(value: any): void;
    UpdateRelationships(value: any): void;
}

export type ResourceQueryFilterName = string;
export type ResourceQueryFilterValue = string;
export type ResourceQuerySortOption = string;
export type ResourceQueryIncludeOption = string;

export interface IResourceContainer {
    data: IResourceObject | IResourceObject[];
    includes: ResourceContainerIncludedResourceTypes;
    restClient: IRestClient;
    uri: string;
    Filter(filter: ResourceQueryFilterName, selector: ResourceFilterType, value: ResourceQueryFilterValue): IResourceContainer;
    Sort(option: ResourceQuerySortOption): IResourceContainer;
    Include(include: ResourceQueryIncludeOption): IResourceContainer;
    PageOffset(pageOffset: number, pageSize: number): IResourceContainer;
    PageNumber(pageNumber: number, pageSize: number): IResourceContainer;
    Add(): IResourceObject;
    Count(): Promise<number>
    Delete(resource: IResourceObject): Promise<void>;
    Find(): Promise<void>
    Get(id: string): Promise<void>
    IncludedObject(type: ResourceObjectType, id: ResourceObjectIdentifier): IResourceObject;
}

// eslint-disable-next-line max-classes-per-file
import {
  hasProperty, isDefined, isObject, isString,
} from '@apigames/json';
import {
  LoadDateTime as LoadDateTimeHelper,
  LoadGeospatialPoint as LoadGeospatialPointHelper,
} from '../helpers';

export type ResourceObjectType = string;
export type ResourceObjectIdentifier = string;

export interface IResourceObjectAttributes {
    LoadData(data: any): void;
}

export type ResourceObjectRelationshipLinkObject = {
    type: ResourceObjectType;
    id: ResourceObjectIdentifier;
}

export type ResourceObjectRelationship = {
    data: ResourceObjectRelationshipLinkObject;
}

export type ResourceObjectRelationships = {
    data: ResourceObjectRelationshipLinkObject[];
};

export type ResourceObjectRelationshipKey = string;

export type ResourceObjectRelationshipKeys = ResourceObjectRelationshipKey[];

export interface IResourceObjectRelationships {
    LoadData(data: any): void;
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
  protected static LoadRelationshipKey(expectedType: string, value: any): ResourceObjectRelationshipKey {
    if (isDefined(value) && (hasProperty(value, 'data') && isObject(value.data)
        && hasProperty(value.data, 'type') && isString(value.data.type)
        && (value.data.type === expectedType)
        && hasProperty(value.data, 'id') && isString(value.data.id)
    )) return value.data.id;

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

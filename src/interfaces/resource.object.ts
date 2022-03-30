// eslint-disable-next-line max-classes-per-file
import {
  hasProperty, isDefined, isNumber, isObject, isString,
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
  protected static LoadRelationshipObject(value: any): ResourceObjectRelationship {
    if (isDefined(value) && (hasProperty(value, 'data') && isObject(value.data)
        && hasProperty(value.data, 'type') && isString(value.data.type)
        && hasProperty(value.data, 'id') && isString(value.data.id)
    )) {
      return {
        data: {
          type: value.data.type,
          id: value.data.id,
        },
      };
    }

    return undefined;
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

import { isDefined } from '@apigames/json';

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

export class ResourceObjectAttributes {
  protected static LoadDateTime(value: string): Date {
    if (isDefined(value)) return new Date(value);
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
}

export type ResourceObjectType = string;
export type ResourceObjectIdentifier = string;

export interface IResourceObjectAttributes {}

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

export interface IResourceObjectRelationships {}

export type ResourceObjectUri = string;

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

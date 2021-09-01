export type ResourceObjectType = string;
export type ResourceObjectIdentifier = string;

export interface IResourceObjectAttributes {}

export type ResourceObjectUri = string;

export interface IResourceObject {
    type: ResourceObjectType;
    id?: ResourceObjectIdentifier;
    attributes: IResourceObjectAttributes
    uri: ResourceObjectUri;
    Deserialize(value: any): IResourceObject;
    Delete(): Promise<void>;
    Save(): Promise<void>;
}

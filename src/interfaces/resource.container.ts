import { IRestClient } from '@apigames/rest-client';
import { IResourceObject, ResourceObjectIdentifier, ResourceObjectType } from './resource.object';
import { ResourceFilterType } from '../classes/resource.container';

export type ResourceFilterName = string;
export type ResourceFilterValue = string;
export type ResourceSortOption = string;
export type ResourceIncludeOption = string;

export interface IResourceContainer {
    data: IResourceObject | IResourceObject[];
    restClient: IRestClient;
    uri: string;
    Filter(filter: ResourceFilterName, selector: ResourceFilterType, value: ResourceFilterValue): IResourceContainer;
    Sort(option: ResourceSortOption): IResourceContainer;
    Include(include: ResourceIncludeOption): IResourceContainer;
    PageOffset(pageOffset: number, pageSize: number): IResourceContainer;
    PageNumber(pageNumber: number, pageSize: number): IResourceContainer;
    Add(): IResourceObject;
    Count(): Promise<number>
    Delete(resource: IResourceObject): Promise<void>;
    Find(): Promise<void>
    Get(id: string): Promise<void>
    IncludedObject(type: ResourceObjectType, id: ResourceObjectIdentifier): IResourceObject;
}

export interface ISDKError {
    code: string,
    title: string,
}

export interface ISDKRequestError extends ISDKError {
    status: number,
    detail?: string,
    source?: any
}

export interface ISDKException {
    code: string;
    message: string;
}

export interface ISDKRequestException {
    status: number;
    items: ISDKRequestError[];
}

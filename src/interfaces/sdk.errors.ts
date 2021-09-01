export interface ISDKError {
    code: string,
    title: string,
}

export interface ISDKRequestError extends ISDKError {
    status: string,
    detail?: string,
    source?: any
}

export interface ISDKException {
    message: string;
    payload?: ISDKError | ISDKError[];
}

export interface ISDKRequestException {
    message: string;
    payload?: ISDKRequestError | ISDKRequestError[];
    status: number;
}

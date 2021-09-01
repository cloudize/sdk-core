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
    code: string;
    message: string;
}

export interface ISDKRequestException {
    code: string;
    message: string;
    payload?: ISDKRequestError | ISDKRequestError[];
    status: number;
}

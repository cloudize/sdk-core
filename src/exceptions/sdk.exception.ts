import { ISDKException } from '..';

export default class SDKException extends Error implements ISDKException {
    private _code: string = '';

    private _message: string = '';

    constructor(code: string, message: string) {
      super(message);
      this.name = 'SDKException';
      this._code = code;
      this._message = message;
    }

    get code(): string {
      return this._code;
    }

    get message(): string {
      return this._message;
    }
}

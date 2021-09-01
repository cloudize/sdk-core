import { ISDKException, ISDKError } from '..';

export default class SDKException implements ISDKException {
    private _code: string = '';

    private _title: string = '';

    constructor(code: string, title: string) {
      this._code = code;
      this._title = title;
    }

    get code(): string {
      return this._code;
    }

    get message(): string {
      return this._title;
    }

    get payload(): ISDKError {
      const thisError: ISDKError = {
        code: this._code,
        title: this._title,
      };

      return thisError;
    }

    get title(): string {
      return this._title;
    }
}

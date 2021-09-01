import { isDefined, isEmpty, isObject } from '@apigames/json';
import { ISDKRequestError, ISDKRequestException } from '..';

export default class SDKRequestException implements ISDKRequestException {
    private _code: string = '';

    private _title: string = '';

    private _status: number = 400;

    private _detail: string = '';

    private _source: any = '';

    constructor(code: string, title: string, status: number, detail?: string, source?: any) {
      this._code = code;
      this._title = title;
      this._status = status;

      if (isDefined(detail)) this._detail = detail;
      if (isDefined(source)) this._source = source;
    }

    get code(): string {
      return this._code;
    }

    get detail(): string {
      return this._detail;
    }

    get message(): string {
      return this._title;
    }

    get payload(): ISDKRequestError {
      const thisError: ISDKRequestError = {
        code: this._code,
        title: this._title,
        status: this._status.toString(),
      };

      if (this._detail) {
        thisError.detail = this._detail;
      }

      if ((this._source) && (isObject(this._source) && (!isEmpty(this._source)))) {
        thisError.source = this._source;
      }

      return thisError;
    }

    get source(): string {
      return this._source;
    }

    get status(): number {
      return this._status;
    }

    get title(): string {
      return this._title;
    }
}

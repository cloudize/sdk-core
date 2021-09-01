import { ISDKRequestError } from '..';

export default class SDKRequestError implements ISDKRequestError {
    private _code: string = '';

    private _title: string = '';

    private _status: number = 500;

    private _detail: string = '';

    private _source: any = '';

    constructor(code: string, title: string, status: number, detail: string, source: any) {
      this._code = code;
      this._title = title;
      this._status = status;
      this._detail = detail;
      this._source = source;
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

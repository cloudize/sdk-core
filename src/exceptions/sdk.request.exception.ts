import { ISDKRequestException, SDKRequestError } from '..';

export default class SDKRequestException extends Error implements ISDKRequestException {
    private _errors: Array<SDKRequestError> = [];

    constructor() {
      super();
      this.name = 'SDKRequestException';
    }

    AddError(code: string, title: string, status: number, detail?: string, source?: any) {
      this._errors.push(new SDKRequestError(code, title, status, detail, source));
    }

    get count(): number {
      return this._errors.length;
    }

    get items(): Array<SDKRequestError> {
      return this._errors;
    }

    get status(): number {
      let thisStatus = 200;

      // eslint-disable-next-line no-restricted-syntax
      for (const error of this.items) {
        if (error.status > thisStatus) {
          thisStatus = error.status;
        }
      }

      if ((thisStatus >= 200) && (thisStatus <= 299)) {
        thisStatus = 200;
      } else if ((thisStatus >= 300) && (thisStatus <= 399)) {
        thisStatus = 300;
      } else if ((thisStatus >= 400) && (thisStatus <= 499)) {
        thisStatus = 400;
      } else {
        thisStatus = 500;
      }

      return thisStatus;
    }
}

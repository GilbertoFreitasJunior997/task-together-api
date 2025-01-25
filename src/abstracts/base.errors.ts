export interface BaseErrorParams {
  cause?: unknown;
}

export class BaseError extends Error {
  constructor(params?: BaseErrorParams) {
    super();

    this.message ||= "Something went wrong! Please try again later.";
    this.cause = params?.cause;
  }
}

export class BaseRepositoryIdMissingError extends BaseError {
  message = "Table has no id.";
}

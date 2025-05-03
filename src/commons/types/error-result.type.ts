/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
export type ErrorResult = {
  statusCode: number;
  error: string;
  message: string;
  details: string | any;
};

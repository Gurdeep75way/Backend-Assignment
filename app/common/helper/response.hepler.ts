/**
 * Interface representing a standard API response.
 * 
 * This interface defines the structure of a typical response returned by the API, including the success status,
 * an optional message, and the data. The data can be an object, null, or any other type.
 * 
 * @interface IResponse
 * @property {boolean} success - Indicates whether the response is successful or not.
 * @property {string} [message] - An optional message providing additional information about the response.
 * @property {object | null | any} data - The data to be returned in the response. Can be any type, including `null`.
 */
interface IResponse {
  success: boolean;
  message?: string;
  data: object | null | any;
}

/**
 * Interface extending `IResponse` for error responses.
 * 
 * This type includes an additional property, `error_code`, to represent the error code returned in the response.
 * 
 * @type ErrorResponse
 * @extends IResponse
 * @property {number} error_code - The error code associated with the response.
 */
export type ErrorResponse = IResponse & {
  error_code: number;
};

/**
 * Creates a successful response object.
 * 
 * This function is used to generate a standard successful response with the provided data and an optional message.
 * It returns an object conforming to the `IResponse` interface with `success` set to `true`.
 * 
 * @function createResponse
 * @param {IResponse["data"]} data - The data to be included in the response.
 * @param {string} [message] - An optional message to be included in the response.
 * @returns {IResponse} A response object containing the provided data, an optional message, and a `success` status of `true`.
 */
export const createResponse = (
  data: IResponse["data"],
  message?: string
): IResponse => {
  return { data, message, success: true };
};

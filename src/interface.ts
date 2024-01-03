/**
 * @description User-Service parameters
 */
export interface IUserOptions {
  uid: number;
}

/**
 * page
 */
export interface PageParam {
  page: number;
  size: number;
}
/**
 * page
 */
export interface IPage<T> {
  page: number;
  size: number;
  records: Array<T>;
  total: number;
}

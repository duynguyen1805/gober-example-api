export interface PagedDriverRequestResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

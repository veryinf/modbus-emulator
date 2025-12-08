declare namespace API {
  export interface SearchParams {
    pageIndex?: number;
    pageSize?: number;
  }

  export interface ResponseStruct {
    errCode: number;
    errMsg: string;
    subMessages?: string[];
  }

  export interface DataSet<T> extends ResponseStruct {
    dataSet: T[];
    hasMore?: boolean;
    total?: number;
  }

  export interface Data<T> extends ResponseStruct {
    data?: T;
  }
}

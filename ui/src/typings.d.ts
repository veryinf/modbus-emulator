declare module API {
  interface DataSet<T> {
    dataSet: T[];
    errCode: number;
    errMsg: string;
  }

  interface Data<T> {
    data: T;
    errCode: number;
    errMsg: string;
  }

  interface ResponseStruct {
    errCode: number;
    errMsg: string;
  }
}

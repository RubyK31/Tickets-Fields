export interface BaseRepositoryInterface {
  findById(
    modelName: string,
    id: number,
    include?: Record<string, any>,
  ): Promise<any>;

  findAll(
    modelName: string,
    pageNumber: number,
    orderBy?: object,
    include?: Record<string, any>,
  ): Promise<{
    totalRecords: number;
    totalPages: number;
    currentPage: number;
    data: any[];
  }>;

  deleteById(modelName: string, id: number): Promise<any>;

  create<T>(
    modelName: string,
    dto: T,
    uniqueCheckFields?: object,
  ): Promise<any>;

  update<T>(
    modelName: string,
    id: number,
    dto: T,
    uniqueCheckFields?: object,
  ): Promise<any>;
}

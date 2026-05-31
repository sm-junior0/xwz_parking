export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export const getPagination = (page?: string | number, limit?: string | number): PaginationParams => {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);

  return {
    page: safePage,
    limit: safeLimit,
    offset: (safePage - 1) * safeLimit,
  };
};

export const buildPaginationMeta = (count: number, page: number, limit: number) => ({
  totalItems: count,
  totalPages: Math.ceil(count / limit) || 1,
  currentPage: page,
  pageSize: limit,
});

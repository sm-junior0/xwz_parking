export const getApiErrorMessage = (error: any, fallback = "Something went wrong") =>
  error?.response?.data?.message ||
  error?.response?.data?.detail ||
  error?.message ||
  fallback;

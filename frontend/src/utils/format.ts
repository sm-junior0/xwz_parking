export const currency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value || 0));

export const formatDateTime = (value: string | null) => {
  if (!value) {
    return "Not yet exited";
  }
  return new Date(value).toLocaleString();
};

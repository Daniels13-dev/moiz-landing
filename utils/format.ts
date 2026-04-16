export const formatCurrency = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined) return "N/A";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPrice = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined) return "";
  return amount.toLocaleString("es-CO");
};

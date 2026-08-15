export const formatPrice = (price) => {
  if (typeof price !== "number") return "تماس بگیرید";
  return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
};

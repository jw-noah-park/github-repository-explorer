const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

const formatNumber = (value) => {
  if (value === null || value === undefined) return "0";
  return new Intl.NumberFormat().format(value);
};

export { formatDate, formatNumber };

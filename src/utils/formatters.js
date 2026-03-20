const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

export { formatDate };

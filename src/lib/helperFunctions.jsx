export const statusToBooleanConverter = (status) => {
  if (status === "active") return true;
  if (status === "inactive") return false;

  return undefined;
};

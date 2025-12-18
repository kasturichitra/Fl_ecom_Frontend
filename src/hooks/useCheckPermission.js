/**
 * Hook to check if the user has a specific permission.
 * Reads permissions from sessionStorage (stored as base64 encoded JSON string).
 *
 * @param {string} permission - The permission string to check.
 * @returns {boolean} - True if the permission exists, false otherwise.
 */
const useCheckPermission = (permission) => {
  try {
    const encryptedPermissions = sessionStorage.getItem("permissions");
    if (!encryptedPermissions) return false;

    const decryptedPermissions = atob(encryptedPermissions);
    const permissions = JSON.parse(decryptedPermissions);

    return Array.isArray(permissions) && permissions.includes(permission);
  } catch (error) {
    console.error("Error checking permission:", error);
    return false;
  }
};

export default useCheckPermission;

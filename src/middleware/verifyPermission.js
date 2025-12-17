import React from "react";

const VerifyPermission = ({ permission, children }) => {
  const encryptedPermissions = sessionStorage.getItem("permissions");

  if (!encryptedPermissions) {
    return null;
  }

  try {
    const decryptedPermissions = atob(encryptedPermissions);
    const permissions = JSON.parse(decryptedPermissions);

    if (Array.isArray(permissions) && permissions.includes(permission)) {
      return children;
    }
  } catch (error) {
    console.error("Error verifying permission:", error);
    return null;
  }

  return null;
};

export default VerifyPermission;

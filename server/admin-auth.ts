const unauthorizedResponse = {
  status: "error" as const,
  message: "Unauthorized.",
};

function readAdminPassword() {
  return process.env.ADMIN_PASSWORD?.trim();
}

export function isAdminAccessConfigured() {
  return Boolean(readAdminPassword());
}

export function isValidAdminPassword(candidate: string | undefined) {
  const configuredPassword = readAdminPassword();

  if (!configuredPassword) {
    return false;
  }

  return candidate === configuredPassword;
}

export function getAdminPasswordFromHeaders(headers: Record<string, string | string[] | undefined>) {
  const headerValue = headers["x-admin-password"];

  if (Array.isArray(headerValue)) {
    return headerValue[0];
  }

  return headerValue;
}

export function getUnauthorizedAdminResult(statusCode = 401) {
  return {
    statusCode,
    body: unauthorizedResponse,
  };
}

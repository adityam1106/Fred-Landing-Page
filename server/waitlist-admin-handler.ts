import { getAdminPasswordFromHeaders, getUnauthorizedAdminResult, isAdminAccessConfigured, isValidAdminPassword } from "./admin-auth.js";
import { listWaitlistEntries } from "./waitlist-store.js";

export type WaitlistAdminEntry = {
  id: string;
  name: string;
  email: string;
  createdAt: string | Date;
};

export async function handleWaitlistAdminRequest({
  headers,
}: {
  headers: Record<string, string | string[] | undefined>;
}): Promise<{
  statusCode: number;
  body:
    | {
        status: "success";
        entries: WaitlistAdminEntry[];
      }
    | {
        status: "error";
        message: string;
      };
}> {
  if (!isAdminAccessConfigured()) {
    return {
      statusCode: 503,
      body: {
        status: "error",
        message: "Admin access is not configured yet.",
      },
    };
  }

  const adminPassword = getAdminPasswordFromHeaders(headers);

  if (!isValidAdminPassword(adminPassword)) {
    return getUnauthorizedAdminResult();
  }

  try {
    const entries = await listWaitlistEntries();

    return {
      statusCode: 200,
      body: {
        status: "success",
        entries,
      },
    };
  } catch (error) {
    console.error("Waitlist admin request failed", error);

    return {
      statusCode: 500,
      body: {
        status: "error",
        message: "Unable to load waitlist entries right now.",
      },
    };
  }
}

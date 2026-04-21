import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleWaitlistAdminRequest } from "../../server/waitlist-admin-handler.js";

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.status(405).json({
      status: "error",
      message: "Method not allowed.",
    });
    return;
  }

  const result = await handleWaitlistAdminRequest({
    headers: request.headers,
  });

  response.status(result.statusCode).json(result.body);
}

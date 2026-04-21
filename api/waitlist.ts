import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleWaitlistSubmission } from "../server/waitlist-handler.js";

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({
      status: "error",
      message: "Method not allowed.",
    });
    return;
  }

  const rateLimitKey =
    request.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() ||
    request.socket.remoteAddress ||
    "unknown";

  const result = await handleWaitlistSubmission({
    body: request.body,
    rateLimitKey,
  });

  response.status(result.statusCode).json(result.body);
}

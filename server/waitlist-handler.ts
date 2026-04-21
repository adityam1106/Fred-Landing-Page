import { Prisma } from "@prisma/client";
import { z } from "zod";
import { checkRateLimit } from "./rate-limit.js";
import { createWaitlistEntry } from "./waitlist-store.js";

const submissionSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email(),
});

export type WaitlistResponseBody = {
  status: "success" | "duplicate" | "error";
  message: string;
};

export async function handleWaitlistSubmission({
  body,
  rateLimitKey,
}: {
  body: unknown;
  rateLimitKey?: string;
}): Promise<{
  statusCode: number;
  body: WaitlistResponseBody;
}> {
  if (rateLimitKey) {
    const rateLimit = checkRateLimit(rateLimitKey);

    if (!rateLimit.allowed) {
      return {
        statusCode: 429,
        body: {
          status: "error",
          message: "Too many attempts. Please try again shortly.",
        },
      };
    }
  }

  const result = submissionSchema.safeParse(body);

  if (!result.success) {
    const nameIssue = result.error.issues.find((issue) => issue.path[0] === "name");
    const emailIssue = result.error.issues.find((issue) => issue.path[0] === "email");

    return {
      statusCode: 400,
      body: {
        status: "error",
        message: nameIssue
          ? "Please enter your name."
          : emailIssue
            ? "Please enter a valid email."
            : "Something went wrong. Please try again.",
      },
    };
  }

  const payload = result.data;
  const name = payload.name.trim();
  const email = payload.email.trim().toLowerCase();

  try {
    await createWaitlistEntry({ name, email });

    return {
      statusCode: 201,
      body: {
        status: "success",
        message: "You’re on the list.",
      },
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return {
        statusCode: 409,
        body: {
          status: "duplicate",
          message: "This email is already registered.",
        },
      };
    }

    console.error("Waitlist submission failed", error);

    return {
      statusCode: 500,
      body: {
        status: "error",
        message: "Something went wrong. Please try again.",
      },
    };
  }
}

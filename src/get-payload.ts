import dotenv from "dotenv";
import path from "path";
import type { InitOptions } from "payload/config";
import payload, { Payload } from "payload";
import nodemailer from "nodemailer";

// Load environment variables
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

// Nodemailer transport setup
const transporter = nodemailer.createTransport({
  host: "smtp.resend.com",
  secure: true,
  port: 465,
  auth: {
    user: "resend",
    pass: process.env.RESEND_API_KEY,
  },
});

// Cache payload client globally to avoid re-initialization
let cached = (global as any).payload;

if (!cached) {
  cached = (global as any).payload = {
    client: null,
    promise: null,
  };
}

// Interface for argument type
interface Args {
  initOptions?: Partial<InitOptions>;
}

// Function to get Payload client
export const getPayloadClient = async ({
  initOptions,
}: Args = {}): Promise<Payload> => {
  // Check for the secret key
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error("PAYLOAD_SECRET is missing");
  }

  // Return cached client if it already exists
  if (cached.client) {
    return cached.client;
  }

  // Initialize the payload client if not cached
  if (!cached.promise) {
    cached.promise = payload.init({
      email: {
        transport: transporter,
        fromAddress: "delivered@resend.dev",
        fromName: "Pacesetter",
      },
      secret: process.env.PAYLOAD_SECRET,
      local: initOptions?.express ? false : true,
      mongoURL: initOptions?.mongoURL ?? process.env.MONGO_URL || false, // Ensuring mongoURL is either string or false
      ...(initOptions || {}),
    });
  }

  try {
    // Cache the client after initializing
    cached.client = await cached.promise;
  } catch (e: unknown) {
    cached.promise = null;
    throw e;
  }

  return cached.client;
};

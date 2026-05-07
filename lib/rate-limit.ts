import { headers } from "next/headers";

// Simple in-memory rate limiter (Limited in serverless, but acts as a first barrier)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto

export async function checkRateLimit(maxRequests: number = 10) {
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for") || "unknown";
  const now = Date.now();
  const userData = rateLimitMap.get(ip) || { count: 0, lastReset: now };

  if (now - userData.lastReset > RATE_LIMIT_WINDOW) {
    userData.count = 1;
    userData.lastReset = now;
  } else {
    userData.count++;
  }

  rateLimitMap.set(ip, userData);

  if (userData.count > maxRequests) {
    throw new Error("Demasiadas peticiones. Por favor intenta más tarde.");
  }
}

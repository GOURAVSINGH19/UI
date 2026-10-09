import { randomUUID } from "node:crypto";
import { cookies, headers } from "next/headers";
import { addLike, getLikes, visitorIds } from "@/lib/likes";

const COOKIE = "vid";
const ONE_YEAR = 60 * 60 * 24 * 365;

// Read-only: who is this visitor? GET uses only this, so a page view has no side effects.
async function readVisitor() {
  const jar = await cookies();
  const head = await headers();
  const ip = head.get("x-forwarded-for")?.split(",")[0]?.trim() || head.get("x-real-ip");
  return { cookieId: jar.get(COOKIE)?.value ?? null, ip };
}

export async function GET() {
  try {
    const { cookieId, ip } = await readVisitor();
    return Response.json(await getLikes(visitorIds(cookieId, ip)));
  } catch {
    return Response.json({ count: null, liked: false }, { status: 503 });
  }
}

// The visitor cookie is issued here, on the actual like.
export async function POST() {
  try {
    const { cookieId: existing, ip } = await readVisitor();
    const cookieId = existing ?? randomUUID();
    if (!existing) {
      (await cookies()).set(COOKIE, cookieId, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: ONE_YEAR, path: "/" });
    }
    return Response.json(await addLike(visitorIds(cookieId, ip)));
  } catch {
    return Response.json({ count: null, liked: false }, { status: 503 });
  }
}

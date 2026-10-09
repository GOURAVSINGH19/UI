import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import postgres from "postgres";

/*
 * Site-wide "likes" counter (the heart in the footer) — one like per person.
 *
 * A person is identified two ways, and a like only counts if *both* are new:
 *   - a random visitor id kept in an httpOnly cookie, and
 *   - a salted SHA-256 hash of their IP address (the raw IP is never stored),
 *     so clearing cookies or opening a private window doesn't allow a second like.
 * Trade-off: people sharing one network (office, home Wi-Fi) share one like.
 *
 * Storage:
 * - Production: Postgres when DATABASE_URL is set. Tables are created on first use:
 *     like_visitors (id text primary key)  — every id that has liked
 *     like_count    (id int primary key, count int) — a single row, id = 1
 * - Otherwise: a JSON file in .data/ — fine for local dev, but serverless hosts
 *   (e.g. Vercel) don't keep files between requests, so set DATABASE_URL there.
 */

const FILE = path.join(process.cwd(), ".data", "likes.json");

const databaseUrl = process.env.DATABASE_URL;
const SALT = process.env.LIKES_SALT ?? "kinetik-likes";

export type LikeState = { count: number; liked: boolean };

/** The ids that identify one person: their visitor cookie and their hashed IP. */
export function visitorIds(cookieId: string | null, ip: string | null): string[] {
  const ids = cookieId ? [`v:${cookieId}`] : [];
  if (ip) ids.push(`ip:${createHash("sha256").update(`${SALT}:${ip}`).digest("hex").slice(0, 32)}`);
  return ids;
}

/* ---- Postgres ----------------------------------------------------------- */

// Reuse one client across hot reloads in dev so we don't leak connections.
const globalForPg = globalThis as unknown as { likesSql?: postgres.Sql; likesReady?: Promise<void> };
const sql = databaseUrl ? (globalForPg.likesSql ??= postgres(databaseUrl, { max: 1, idle_timeout: 20 })) : null;

function ready(db: postgres.Sql): Promise<void> {
  globalForPg.likesReady ??= (async () => {
    await db`create table if not exists like_visitors (id text primary key, created_at timestamptz not null default now())`;
    await db`create table if not exists like_count (id int primary key, count int not null default 0)`;
    await db`insert into like_count (id, count) values (1, 0) on conflict (id) do nothing`;
  })().catch((err) => {
    globalForPg.likesReady = undefined; // retry on the next request
    throw err;
  });
  return globalForPg.likesReady;
}

/* ---- Local file fallback ------------------------------------------------- */

type FileData = { count: number; visitors: string[] };

async function readData(): Promise<FileData> {
  try {
    const data = JSON.parse(await readFile(FILE, "utf8")) as Partial<FileData>;
    return { count: Number(data.count) || 0, visitors: Array.isArray(data.visitors) ? data.visitors : [] };
  } catch {
    return { count: 0, visitors: [] };
  }
}

async function writeData(data: FileData) {
  await mkdir(path.dirname(FILE), { recursive: true });
  await writeFile(FILE, JSON.stringify(data));
}

/* ---- API ----------------------------------------------------------------- */

export async function getLikes(ids: string[]): Promise<LikeState> {
  if (sql) {
    await ready(sql);
    const [[row], seen] = await Promise.all([
      sql<{ count: number }[]>`select count from like_count where id = 1`,
      ids.length ? sql`select 1 from like_visitors where id in ${sql(ids)} limit 1` : Promise.resolve([]),
    ]);
    return { count: row?.count ?? 0, liked: seen.length > 0 };
  }
  const data = await readData();
  const visitors = new Set(data.visitors);
  return { count: data.count, liked: ids.some((id) => visitors.has(id)) };
}

/** Adds a like only if none of this person's ids has liked before. */
export async function addLike(ids: string[]): Promise<LikeState> {
  if (sql) {
    await ready(sql);
    // Insert ... on conflict do nothing only returns rows it actually added, and a concurrent
    // insert of the same id waits on the first transaction — safe against double clicks / parallel tabs.
    const count = await sql.begin(async (tx) => {
      const added = ids.length
        ? await tx`insert into like_visitors ${tx(ids.map((id) => ({ id })))} on conflict (id) do nothing returning id`
        : [];
      const isNew = ids.length > 0 && added.length === ids.length;
      const [row] = isNew
        ? await tx<{ count: number }[]>`update like_count set count = count + 1 where id = 1 returning count`
        : await tx<{ count: number }[]>`select count from like_count where id = 1`;
      return row?.count ?? 0;
    });
    return { count, liked: true };
  }
  const data = await readData();
  const visitors = new Set(data.visitors);
  const isNew = ids.every((id) => !visitors.has(id));
  for (const id of ids) if (!visitors.has(id)) data.visitors.push(id);
  if (isNew) data.count += 1;
  await writeData(data);
  return { count: data.count, liked: true };
}

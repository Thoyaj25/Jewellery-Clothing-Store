import { NextResponse } from "next/server";
import sql from "@/src/lib/db";
import { ensureAuditTable } from "@/src/lib/audit";

export async function GET(req: Request) {
  try {
    await ensureAuditTable();

    const url = new URL(req.url);

    const page = Math.max(
      1,
      Number(url.searchParams.get("page") || "1")
    );

    const limit = Math.min(
      100,
      Math.max(1, Number(url.searchParams.get("limit") || "20"))
    );

    const admin = url.searchParams.get("admin");
    const action = url.searchParams.get("action");

    const offset = (page - 1) * limit;

    let entries;
    let countRes;

    if (admin && action) {
      entries = await sql`
        SELECT id, admin, action, product_id, payload, ip, created_at
        FROM admin_audit
        WHERE admin = ${admin}
          AND action = ${action}
        ORDER BY created_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;

      countRes = await sql`
        SELECT COUNT(*) AS count
        FROM admin_audit
        WHERE admin = ${admin}
          AND action = ${action}
      `;
    } else if (admin) {
      entries = await sql`
        SELECT id, admin, action, product_id, payload, ip, created_at
        FROM admin_audit
        WHERE admin = ${admin}
        ORDER BY created_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;

      countRes = await sql`
        SELECT COUNT(*) AS count
        FROM admin_audit
        WHERE admin = ${admin}
      `;
    } else if (action) {
      entries = await sql`
        SELECT id, admin, action, product_id, payload, ip, created_at
        FROM admin_audit
        WHERE action = ${action}
        ORDER BY created_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;

      countRes = await sql`
        SELECT COUNT(*) AS count
        FROM admin_audit
        WHERE action = ${action}
      `;
    } else {
      entries = await sql`
        SELECT id, admin, action, product_id, payload, ip, created_at
        FROM admin_audit
        ORDER BY created_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;

      countRes = await sql`
        SELECT COUNT(*) AS count
        FROM admin_audit
      `;
    }

    const total = Number(countRes[0]?.count ?? 0);

    return NextResponse.json({
      entries,
      page,
      limit,
      total,
    });
  } catch (err) {
    console.error("AUDIT GET ERROR:", err);

    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}

import { NextRequest } from "next/server"

const RAW = process.env.NEXT_PUBLIC_API_URL || "https://ethio-guide-backend-1.onrender.com"
const BASE = RAW.replace(/\/$/, "")
const HAS_API_SUFFIX = /\/api\/v1$/.test(BASE)

export async function GET(req: NextRequest) {
	const search = req.nextUrl.search || ""
	const dest = HAS_API_SUFFIX
		? `${BASE}/checklists/myProcedures${search}`
		: `${BASE}/api/v1/checklists/myProcedures${search}`

	const headers: Record<string, string> = {
		Accept: req.headers.get("accept") || "application/json",
	}
	const auth = req.headers.get("authorization")
	if (auth) headers["authorization"] = auth

	const res = await fetch(dest, { headers, cache: "no-store" })
	const body = await res.arrayBuffer()
	return new Response(body, {
		status: res.status,
		headers: {
			"content-type": res.headers.get("content-type") || "application/json",
			"cache-control": "no-store",
		},
	})
}

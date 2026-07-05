import { NextRequest } from "next/server"

const RAW = process.env.NEXT_PUBLIC_API_URL || "https://ethio-guide-backend-dlwz.onrender.com"
const BASE = RAW.replace(/\/$/, "")
const HAS_API_SUFFIX = /\/api\/v1$/.test(BASE)

export async function POST(req: NextRequest) {
	const body = await req.text()
	const dest = HAS_API_SUFFIX
		? `${BASE}/checklists`
		: `${BASE}/api/v1/checklists`

	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		Accept: req.headers.get("accept") || "application/json",
	}
	const auth = req.headers.get("authorization")
	if (auth) headers["authorization"] = auth

	const res = await fetch(dest, { 
		method: "POST",
		headers, 
		body,
		cache: "no-store" 
	})
	const responseBody = await res.arrayBuffer()
	return new Response(responseBody, {
		status: res.status,
		headers: {
			"content-type": res.headers.get("content-type") || "application/json",
			"cache-control": "no-store",
		},
	})
}

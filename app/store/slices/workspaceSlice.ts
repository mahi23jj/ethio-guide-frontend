import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ProceduresResponse } from "@/app/types/myprocedures";

// Read token from localStorage/sessionStorage/cookie/env
function readToken(): string | null {
  if (typeof window !== "undefined") {
    const ls =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("token") ||
      localStorage.getItem("authToken");
    const ss =
      sessionStorage.getItem("accessToken") ||
      sessionStorage.getItem("access_token") ||
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("authToken");
    const cookieMatch =
      typeof document !== "undefined"
        ? document.cookie.match(/(?:^|; )accessToken=([^;]+)/)
        : null;
    const cookieToken = cookieMatch ? decodeURIComponent(cookieMatch[1]) : null;
    return ls || ss || cookieToken || null;
  }
  // server fallback
  return (
    process.env.NEXT_PUBLIC_ACCESS_TOKEN || process.env.ACCESS_TOKEN || null
  );
}

const RAW_BACKEND = (
  process.env.NEXT_PUBLIC_API_URL || "https://ethio-guide-backend-dlwz.onrender.com"
).replace(/\/$/, "");
const API_BASE = /\/api\/v1$/.test(RAW_BACKEND)
  ? RAW_BACKEND
  : `${RAW_BACKEND}/api/v1/`;

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE,
    prepareHeaders: (headers) => {
      const token = readToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
        headers.set("lang", localStorage.getItem("i18nextLng") || "en");
      }
      return headers;
    },
  }),
  tagTypes: ["Procedure", "Discussion"],
  endpoints: (builder) => ({
    getMyProcedures: builder.query<
      ProceduresResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 20 } = {}) => {
        const token = readToken();
        // Debug: remove after verifying
        if (typeof window !== "undefined") {
          console.debug(
            "getMyProcedures Authorization present:",
            Boolean(token)
          );
        }
        return {
          url: `checklists/procedures?page=${page}&limit=${limit}`,
          method: "GET",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        };
      },
      providesTags: ["Procedure"],
    }),
  }),
});

export const { useGetMyProceduresQuery } = apiSlice;

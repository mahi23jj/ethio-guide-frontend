import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ProceduresResponse } from "@/app/types/procedures";

export const proceduresApi = createApi({
  reducerPath: "proceduresApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://ethio-guide-backend-1.onrender.com/api/v1/",
    // no Authorization headers required
    prepareHeaders: (headers) => {
      headers.set("lang", localStorage.getItem("i18nextLng") || "en");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getProcedures: builder.query<
      ProceduresResponse,
      { page?: number; limit?: number; q?: string } | void
    >({
      query: (args) => {
        const page = args?.page ?? 1;
        const limit = args?.limit ?? 10;
        const q = (args?.q ?? "").trim();
        const search = q ? `&q=${encodeURIComponent(q)}` : "";
        return `procedures?page=${page}&limit=${limit}${search}`;
      },
    }),
  }),
});

export const { useGetProceduresQuery, useLazyGetProceduresQuery } =
  proceduresApi;

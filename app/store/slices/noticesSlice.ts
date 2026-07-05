import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { NoticesResponse } from "../../types/notices";

export const noticesApi = createApi({
  reducerPath: "noticesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://ethio-guide-backend-1.onrender.com/api/v1/",
    // no auth headers for notices
  }),
  endpoints: (builder) => ({
    getNotices: builder.query<
      NoticesResponse,
      { page?: number; limit?: number } | void
    >({
      query: (args) => {
        const page = args?.page ?? 1;
        const limit = args?.limit ?? 10;
        return `notices?page=${page}&limit=${limit}`;
      },
    }),
  }),
});

export const { useGetNoticesQuery, useLazyGetNoticesQuery } = noticesApi;

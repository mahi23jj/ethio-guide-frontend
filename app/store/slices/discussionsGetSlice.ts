import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { DiscussionsList, DiscussionPost } from "@/app/types/discussions";

function readEnvToken(): string | null {
  return (
    process.env.NEXT_PUBLIC_ACCESS_TOKEN || process.env.ACCESS_TOKEN || null
  );
}
function readAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken") || null;
}

export const discussionsListApi = createApi({
  reducerPath: "discussionsListApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NEXT_PUBLIC_API_URL ||
      "https://ethio-guide-backend-dlwz.onrender.com/api/v1",
    prepareHeaders: (headers) => {
      const token = readAuthToken() || readEnvToken();
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getDiscussions: builder.query<
      DiscussionsList,
      { page?: number; limit?: number } | void
    >({
      query: (args) => {
        const page = args?.page ?? 0;
        const limit = args?.limit ?? 10;
        return `discussions?page=${page}&limit=${limit}`;
      },
      transformResponse: (res: unknown): DiscussionsList => {
        const r = res as
          | {
              Posts?: {
                posts?: DiscussionPost[];
                total?: number;
                page?: number;
                limit?: number;
              };
            }
          | {
              posts?: DiscussionPost[];
              total?: number;
              page?: number;
              limit?: number;
            };

        const box: {
          posts?: DiscussionPost[];
          total?: number;
          page?: number;
          limit?: number;
        } =
          (
            r as {
              Posts?: {
                posts?: DiscussionPost[];
                total?: number;
                page?: number;
                limit?: number;
              };
            }
          )?.Posts ??
          (r as {
            posts?: DiscussionPost[];
            total?: number;
            page?: number;
            limit?: number;
          });
        const posts: DiscussionPost[] = Array.isArray(box?.posts)
          ? box.posts
          : [];
        const total = Number(box?.total ?? 0);
        const page = Number(box?.page ?? 0);
        const limit = Number(box?.limit ?? (posts.length || 10));
        return { posts, total, page, limit };
      },
    }),
  }),
});

export const { useGetDiscussionsQuery } = discussionsListApi;

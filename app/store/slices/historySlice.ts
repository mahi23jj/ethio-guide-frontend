import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ChatHistoryItem } from "@/app/types/chat";

function readEnvToken(): string | null {
  return (
    process.env.NEXT_PUBLIC_ACCESS_TOKEN || process.env.ACCESS_TOKEN || null
  );
}

export const historyApi = createApi({
  reducerPath: "historyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://ethio-guide-backend-dlwz.onrender.com/api/v1",
    prepareHeaders: (headers) => {
      // keep default header set (may be overwritten by endpoint-level headers)
      const token =
        (typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null) || readEnvToken();
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getChatHistory: builder.query<ChatHistoryItem[], void>({
      query: () => {
        const lsToken =
          typeof window !== "undefined"
            ? localStorage.getItem("accessToken") ||
              localStorage.getItem("token") ||
              localStorage.getItem("authToken") ||
              localStorage.getItem("access_token")
            : null;
        const envToken = readEnvToken();
        return {
          url: "/ai/history",
          method: "GET",
          headers:
            lsToken || envToken
              ? { Authorization: `Bearer ${lsToken ?? envToken}` }
              : undefined,
        };
      },
      transformResponse: (res: unknown): ChatHistoryItem[] => {
        console.log("Raw history response:", res);
        type RawHistoryItem = {
          id?: string;
          _id?: string;
          uuid?: string;
          request?: string;
          procedures?: { name?: string }[];
          response?: string;
          updatedAt?: string;
          createdAt?: string;
        };
        const r = res as { history?: RawHistoryItem[] } | RawHistoryItem[];
        const items = Array.isArray(r)
          ? r
          : Array.isArray(r?.history)
          ? r.history
          : [];
        return (items ?? []).map(
          (it: RawHistoryItem): ChatHistoryItem => ({
            id: String(
              it.id ?? it._id ?? it.uuid ?? Math.random().toString(36).slice(2)
            ),
            title: String(it.request ?? it.procedures?.[0]?.name ?? "Untitled"),
            lastMessage: String(it.response ?? ""),
            timestamp: String(it.updatedAt ?? it.createdAt ?? ""),
            messageCount: Number(it.procedures?.length ?? 0),
          })
        );
      },
    }),
    postTranslate: builder.mutation<
      { translated?: string; lang?: string } | unknown,
      { content: string; lang: string }
    >({
      query: (body) => {
        const lsToken =
          typeof window !== "undefined"
            ? localStorage.getItem("accessToken") ||
              localStorage.getItem("token") ||
              localStorage.getItem("authToken") ||
              localStorage.getItem("access_token")
            : null;
        const envToken = readEnvToken();
        return {
          url: "/translate",
          method: "POST",
          body,
          headers:
            lsToken || envToken
              ? { Authorization: `Bearer ${lsToken ?? envToken}` }
              : undefined,
        };
      },
    }),
  }),
});

export const {
  useGetChatHistoryQuery,
  useLazyGetChatHistoryQuery,
  usePostTranslateMutation,
} = historyApi;

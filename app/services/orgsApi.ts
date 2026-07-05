import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Helper to get token from localStorage
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const orgsApi = createApi({
  reducerPath: 'orgsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://ethio-guide-backend-dlwz.onrender.com/api/v1/',
    prepareHeaders: (headers) => {
      const token = getAuthToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getOrgs: builder.query({
      query: (params) => {
        let url = 'orgs?';
        if (params?.type) url += `type=${encodeURIComponent(params.type)}&`;
        if (params?.q) url += `q=${encodeURIComponent(params.q)}&`;
        url = url.replace(/&$/, '');
        return url;
      },
    }),
    createProcedure: builder.mutation({
      query: ({ orgId, ...body }) => ({
        url: `orgs/${orgId}/procedures`,
        method: 'POST',
        body,
      }),
    }),
    getOrgNotices: builder.query({
      query: (orgId) => `orgs/${orgId}/notices`,
    }),

    // Scaffolded endpoints for dashboard
    getOrgMetrics: builder.query({
      query: (orgId) => `orgs/${orgId}/metrics`,
    }),
    getOrgRecentActivity: builder.query({
      query: (orgId) => `orgs/${orgId}/activity`,
    }),
    getOrgTopProcedures: builder.query({
      query: (orgId) => `orgs/${orgId}/top-procedures`,
    }),
    createNotice: builder.mutation({
      query: ({ orgId, ...body }) => ({
        url: `orgs/${orgId}/notices`,
        method: 'POST',
        body,
      }),
    }),

    // --- Procedure Management ---
getOrgProcedures: builder.query({
  query: (orgId) => `orgs/${orgId}/procedures`,
}),
    updateProcedure: builder.mutation({
      query: ({ orgId, procedureId, ...body }) => ({
        url: `orgs/${orgId}/procedures/${procedureId}`,
        method: 'PUT',
        body,
      }),
    }),
    deleteProcedure: builder.mutation({
      query: ({ orgId, procedureId }) => ({
        url: `orgs/${orgId}/procedures/${procedureId}`,
        method: 'DELETE',
      }),
    }),

    // --- Notice Management ---
    updateNotice: builder.mutation({
      query: ({ orgId, noticeId, ...body }) => ({
        url: `orgs/${orgId}/notices/${noticeId}`,
        method: 'PUT',
        body,
      }),
    }),
    deleteNotice: builder.mutation({
      query: ({ orgId, noticeId }) => ({
        url: `orgs/${orgId}/notices/${noticeId}`,
        method: 'DELETE',
      }),
    }),

    // --- Feedback Management ---
    getOrgFeedback: builder.query({
      query: (orgId) => `orgs/${orgId}/feedback`,
    }),
    respondToFeedback: builder.mutation({
      query: ({ orgId, feedbackId, ...body }) => ({
        url: `orgs/${orgId}/feedback/${feedbackId}/response`,
        method: 'POST',
        body,
      }),
    }),

    // --- Organization Profile ---
    getOrgProfile: builder.query({
      query: (orgId) => `orgs/${orgId}`,
    }),
    updateOrgProfile: builder.mutation({
      query: ({ orgId, ...body }) => ({
        url: `orgs/${orgId}`,
        method: 'PUT',
        body,
      }),
    }),
  }),
});


export const {
  useGetOrgsQuery,
  useCreateProcedureMutation,
  useCreateNoticeMutation,
  useGetOrgNoticesQuery,
  useGetOrgMetricsQuery,
  useGetOrgRecentActivityQuery,
  useGetOrgTopProceduresQuery,
  // Procedures
  useGetOrgProceduresQuery,
  useUpdateProcedureMutation,
  useDeleteProcedureMutation,
  // Notices
  useUpdateNoticeMutation,
  useDeleteNoticeMutation,
  // Feedback
  useGetOrgFeedbackQuery,
  useRespondToFeedbackMutation,
  // Org Profile
  useGetOrgProfileQuery,
  useUpdateOrgProfileMutation,
} = orgsApi;

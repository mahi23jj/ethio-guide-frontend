// "use client";

// import React from "react";
// import { useRouter } from "next/navigation";
// import { Card, CardContent } from "@/components/ui/card";
// import { Calendar, FileText, Building2 } from "lucide-react";
// import { Button } from "@/components/ui/button";

// import { notices } from "@/lib/noticesData";

// export default function NoticeDetailPage({ params }: { params: { id: string } }) {
//   const router = useRouter();
//   const noticeId = Number(params.id);
//   const notice = notices.find(n => n.id === noticeId);

//   if (!notice) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold mb-4">Notice Not Found</h2>
//           <button className="bg-[#3A6A8D] hover:bg-[#2d5470] text-white px-4 py-2 rounded" onClick={() => router.back()}>
//             Back to Notices
//           </button>
//         </div>
//       </div>
//     );
//   }
//   return (
//     <main className="min-h-screen w-full bg-gray-50 relative overflow-hidden p-4 sm:p-6 md:p-8">
//       {/* subtle brand orbs */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-24 -right-24 w-56 h-56 rounded-full blur-3xl" style={{ background: 'radial-gradient(closest-side, rgba(167,179,185,0.10), rgba(167,179,185,0))' }} />
//         <div className="absolute -bottom-28 -left-28 w-64 h-64 rounded-full blur-3xl" style={{ background: 'radial-gradient(closest-side, rgba(94,156,141,0.10), rgba(94,156,141,0))' }} />
//       </div>

//       <div className="relative z-10 max-w-3xl mx-auto space-y-6">
//         {/* Back button */}
//         <div className="flex items-center">
//           <Button variant="outline" onClick={() => router.back()} className="border-[#3a6a8d] text-[#3a6a8d] hover:bg-[#3a6a8d]/10">
//             Back to Notices
//           </Button>
//         </div>

//         <h1 className="text-2xl font-semibold text-[#111827]">{notice.title}</h1>

//         {/* Meta Card: Published + Organization */}
//         <Card className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#e5e7eb] shadow-xl relative overflow-hidden">
//           <div className="absolute inset-0 bg-gradient-to-r from-[#3a6a8d]/10 via-transparent to-[#5e9c8d]/10" />
//           <CardContent className="relative z-10 p-4">
//             <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
//               <span className="flex items-center gap-2 text-[#4b5563]">
//                 <Calendar className="w-4 h-4" />
//                 <span className="hidden sm:inline">Published:</span>
//                 <span className="font-medium text-[#111827]">{notice.published}</span>
//               </span>
//               <span className="flex items-center gap-2 text-[#4b5563]">
//                 <Building2 className="w-4 h-4" />
//                 <span className="hidden sm:inline">Organization:</span>
//                 <span className="font-semibold text-[#111827]">{notice.organization}</span>
//               </span>
//               {/* No department/category chip per request */}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Main Notice Content */}
//         <Card className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#e5e7eb] shadow-xl relative overflow-hidden">
//           <div className="absolute inset-0 bg-gradient-to-r from-[#3a6a8d]/5 via-transparent to-[#5e9c8d]/5" />
//           <CardContent className="relative z-10 p-6">
//             <p className="text-[#374151] mb-4">Dear Team Members,</p>
//             <p className="text-[#374151] mb-4">{notice.description}</p>
//             {Array.isArray(notice.keyChanges) && notice.keyChanges.length > 0 && (
//               <>
//                 <h2 className="font-semibold text-[#111827] mb-2">Key Policy Changes:</h2>
//                 <ul className="list-disc ml-6 mb-4 text-[#374151]">
//                   {notice.keyChanges.map((change, idx) => (
//                     <li key={idx}>{change}</li>
//                   ))}
//                 </ul>
//               </>
//             )}
//             {Array.isArray(notice.securityUpdates) && notice.securityUpdates?.length > 0 && (
//               <>
//                 <h2 className="font-semibold text-[#111827] mb-2">Security Protocol Updates:</h2>
//                 <ul className="list-disc ml-6 mb-4 text-[#374151]">
//                   {notice.securityUpdates?.map((update, idx) => (
//                     <li key={idx}>{update}</li>
//                   ))}
//                 </ul>
//               </>
//             )}
//             <p className="text-[#374151] mt-4">For questions regarding these policy changes, please contact the HR department or attend one of our information sessions scheduled for next week. Your cooperation in implementing these changes is greatly appreciated.</p>
//             <p className="text-[#374151] mt-4">Best regards, <span className="font-semibold">Sarah Johnson</span> HR Director,<br />TechCorp Solutions</p>
//           </CardContent>
//         </Card>

//         {/* Attachments */}
//         {Array.isArray(notice.attachments) && notice.attachments?.length > 0 && (
//           <Card className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#e5e7eb] shadow-xl relative overflow-hidden">
//             <div className="absolute inset-0 bg-gradient-to-r from-[#3a6a8d]/5 via-transparent to-[#5e9c8d]/5" />
//             <CardContent className="relative z-10 p-6">
//               <h2 className="font-semibold text-[#111827] mb-4 flex items-center gap-2">
//                 <FileText className="w-5 h-5" style={{ color: '#3a6a8d' }} /> Attachments
//               </h2>
//               <div className="space-y-4">
//                 {notice.attachments?.map((file, idx) => (
//                   <div key={idx} className="flex items-center gap-4 p-4 bg-white/70 rounded-xl border border-[#e5e7eb]">
//                     <FileText className={`w-6 h-6 ${file.name.endsWith('.pdf') ? 'text-red-500' : 'text-blue-500'}`} />
//                     <div className="flex-1">
//                       <span className="font-medium text-[#111827]">{file.name}</span>
//                       <div className="text-xs text-[#6b7280]">{file.size}</div>
//                     </div>
//                     <button className="text-[#3a6a8d] hover:underline">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" /></svg>
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </main>
//   );
// }


"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, FileText, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { notices } from "@/lib/noticesData";

export default function NoticeDetailPage() {
  const { t } = useTranslation("user");
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const noticeId = Number(params.id);
  const notice = notices.find(n => n.id === noticeId);

  if (!notice) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t("notices.detail.not_found")}</h2>
          <button
            className="bg-[#3A6A8D] hover:bg-[#2d5470] text-white px-4 py-2 rounded"
            onClick={() => router.back()}
          >
            {t("notices.detail.actions.back_to_notices")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full bg-gray-50 relative overflow-hidden p-4 sm:p-6 md:p-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full blur-3xl bg-[radial-gradient(closest-side,rgba(167,179,185,0.10),rgba(167,179,185,0))]" />
        <div className="absolute -bottom-28 -left-28 h-64 w-64 rounded-full blur-3xl bg-[radial-gradient(closest-side,rgba(94,156,141,0.10),rgba(94,156,141,0))]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        <div className="flex items-center">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="border-[#3a6a8d] text-[#3a6a8d] hover:bg-[#3a6a8d]/10"
          >
            {t("notices.detail.actions.back_to_notices")}
          </Button>
        </div>

        <h1 className="text-2xl font-semibold text-[#111827]">{notice.title ?? t("notices.default_title")}</h1>

        <Card className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#e5e7eb] shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#3a6a8d]/10 via-transparent to-[#5e9c8d]/10" />
          <CardContent className="relative z-10 p-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
              <span className="flex items-center gap-2 text-[#4b5563]">
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">{t("notices.published")}</span>
                <span className="font-medium text-[#111827]">{notice.published ?? t("notices.unknown_date")}</span>
              </span>
              <span className="flex items-center gap-2 text-[#4b5563]">
                <Building2 className="w-4 h-4" />
                <span className="hidden sm:inline">{t("notices.organization")}</span>
                <span className="font-semibold text-[#111827]">{notice.organization ?? t("notices.default_organization")}</span>
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#e5e7eb] shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#3a6a8d]/5 via-transparent to-[#5e9c8d]/5" />
          <CardContent className="relative z-10 p-6">
            <p className="text-[#374151] mb-4">{t("notices.detail.greeting")}</p>
            <p className="text-[#374151] mb-4">{notice.description ?? t("notices.detail.default_description")}</p>
            {Array.isArray(notice.keyChanges) && notice.keyChanges.length > 0 && (
              <>
                <h2 className="font-semibold text-[#111827] mb-2">{t("notices.detail.key_changes")}</h2>
                <ul className="list-disc ml-6 mb-4 text-[#374151]">
                  {notice.keyChanges.map((change, idx) => (
                    <li key={idx}>{change}</li>
                  ))}
                </ul>
              </>
            )}
            {Array.isArray(notice.securityUpdates) && notice.securityUpdates?.length > 0 && (
              <>
                <h2 className="font-semibold text-[#111827] mb-2">{t("notices.detail.security_updates")}</h2>
                <ul className="list-disc ml-6 mb-4 text-[#374151]">
                  {notice.securityUpdates?.map((update, idx) => (
                    <li key={idx}>{update}</li>
                  ))}
                </ul>
              </>
            )}
            <p className="text-[#374151] mt-4">{t("notices.detail.contact_info")}</p>
            <p className="text-[#374151] mt-4">
              {t("notices.detail.closing")} <span className="font-semibold">{notice.author ?? t("notices.detail.default_author")}</span> {t("notices.detail.author_title")},
              <br />{notice.organization ?? t("notices.default_organization")}
            </p>
          </CardContent>
        </Card>

        {Array.isArray(notice.attachments) && notice.attachments?.length > 0 && (
          <Card className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#e5e7eb] shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#3a6a8d]/5 via-transparent to-[#5e9c8d]/5" />
            <CardContent className="relative z-10 p-6">
              <h2 className="font-semibold text-[#111827] mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" style={{ color: '#3a6a8d' }} /> {t("notices.detail.attachments")}
              </h2>
              <div className="space-y-4">
                {notice.attachments?.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-white/70 rounded-xl border border-[#e5e7eb]">
                    <FileText className={`w-6 h-6 ${file.name.endsWith('.pdf') ? 'text-red-500' : 'text-blue-500'}`} />
                    <div className="flex-1">
                      <span className="font-medium text-[#111827]">{file.name}</span>
                      <div className="text-xs text-[#6b7280]">{file.size}</div>
                    </div>
                    <button
                      className="text-[#3a6a8d] hover:underline"
                      aria-label={`Download ${file.name}`}
                      title={`Download ${file.name}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}


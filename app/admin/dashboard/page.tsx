import React from "react";
import AdminDashboard from "@/components/admin/AdminDashboard";

const page = async () => {
  const res = await fetch(
    "https://ethio-guide-backend-dlwz.onrender.com/api/v1/procedures",
    { cache: "no-store" }
  );

  const res2 = await fetch(
    "https://ethio-guide-backend-dlwz.onrender.com/api/v1/notices",
    { cache: "no-store" }
  );

  if (!res.ok || !res2.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();
  const data2 = await res2.json();

  // console.log("Fetched procedures:", data.pagination);
  console.log("Fetched notices:", data2);
  const total = data.pagination.total;
  const totalNotices = data2.total;

  // const total = data.pagination.total;
  return (
    <>
      <AdminDashboard totalNotices={totalNotices} totalProcedures={total} />
    </>
  );
};

export default page;

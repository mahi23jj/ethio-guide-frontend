import React from "react";
import OrgDashboard from "@/components/organizationalFiles/OrgDashboard";

const page = async () => {
  const res = await fetch(
    "https://ethio-guide-backend-1.onrender.com/api/v1/procedures",
    { cache: "no-store" }
  );

  const res2 = await fetch(
    "https://ethio-guide-backend-1.onrender.com/api/v1/notices",
    { cache: "no-store" }
  );

  if (!res.ok || !res2.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();
  const data2 = await res2.json();

  console.log("Fetched procedures:", data.pagination.total);
  console.log("Fetched notices:", data2);
  const total = data.pagination.total;
  const totalNotices = data2.total;

  // const total =
  return <OrgDashboard totalNotices={totalNotices} totalProcedures={total} />;
};

export default page;

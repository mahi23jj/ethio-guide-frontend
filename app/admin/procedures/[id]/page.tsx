import EditProcedurePage from "../../(adminRelatedPages)/editProcedure/page";
import ProcedurePropCapital from "@/types/procedureRecive";
// import { getServerSession } from "next-auth/next";
// import { options } from "@/app/api/auth/[...nextauth]/options";

interface Props {
  params: { id: string };
}

export default async function EditProcedure({ params }: Props) {
  const { id } = await params;
  // const session = await getServerSession(options);
  // const token = session?.accessToken;
  const language = localStorage.getItem("i18nextLng") || "en";
  console.log("lang",language)
 
  
  const res = await fetch(
    `https://ethio-guide-backend-dlwz.onrender.com/api/v1/procedures/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
        'lang': localStorage.getItem("i18nextLng") || "en",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch procedure");
  }

  const procedure: ProcedurePropCapital = await res.json();
  console.log("get",procedure)

  return <EditProcedurePage procedure={procedure} />;
}

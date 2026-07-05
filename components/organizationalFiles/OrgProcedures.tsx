"use client";
import { Input } from "@/components/ui/input";
import { BiSolidEdit } from "react-icons/bi";
// import { FaEye } from "react-icons/fa";
import { TableCell } from "@/components/ui/table";
import DeleteConfirmDialog from "../shared/AdminAndOrg/DeleteConfirmDialog";
import { toast } from "sonner";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import ProcedureProp from "@/types/procedure";
import Pagination from "../shared/pagination";
import { Button } from "../ui/button";

// const procedures = [
//   {
//     id: "1",
//     orgId: "org-001",
//     title: "Driver's License Application",
//     requirements: [
//       { text: "Proof of identity" },
//       { text: "Medical certificate" },
//     ],
//     steps: [
//       { order: 1, text: "Fill out the application form" },
//       { order: 2, text: "Submit required documents" },
//       { order: 3, text: "Take vision and written tests" },
//     ],
//     fees: [{ label: "Application Fee", amount: 500, currency: "Birr" }],
//     processingTime: { minDays: 5, maxDays: 10 },
//     updatedAt: "2024-12-15",
//     createdAt: "2024-10-01",
//   },
//   {
//     id: "2",
//     orgId: "org-001",
//     title: "Vehicle Registration Renewal",
//     requirements: [
//       { text: "Previous registration certificate" },
//       { text: "Proof of insurance" },
//     ],
//     steps: [
//       { order: 1, text: "Submit renewal application" },
//       { order: 2, text: "Pay renewal fee" },
//       { order: 3, text: "Collect updated registration card" },
//     ],
//     fees: [{ label: "Renewal Fee", amount: 300, currency: "Birr" }],
//     processingTime: { minDays: 2, maxDays: 5 },
//     updatedAt: "2024-12-12",
//     createdAt: "2024-09-20",
//   },
//   {
//     id: "3",
//     orgId: "org-002",
//     title: "Commercial License Application",
//     requirements: [
//       { text: "Valid driver’s license" },
//       { text: "Medical fitness certificate" },
//     ],
//     steps: [
//       { order: 1, text: "Complete commercial license form" },
//       { order: 2, text: "Submit business verification" },
//       { order: 3, text: "Take driving test with commercial vehicle" },
//     ],
//     fees: [{ label: "Application Fee", amount: 1000, currency: "Birr" }],
//     processingTime: { minDays: 7, maxDays: 14 },
//     updatedAt: "2024-12-10",
//     createdAt: "2024-08-15",
//   },
//   {
//     id: "4",
//     orgId: "org-003",
//     title: "Traffic Violation Appeal",
//     requirements: [
//       { text: "Copy of violation ticket" },
//       { text: "Written appeal statement" },
//     ],
//     steps: [
//       { order: 1, text: "Submit appeal application" },
//       { order: 2, text: "Attend hearing session" },
//       { order: 3, text: "Receive appeal decision" },
//     ],
//     fees: [{ label: "Appeal Fee", amount: 200, currency: "Birr" }],
//     processingTime: { minDays: 3, maxDays: 7 },
//     updatedAt: "2024-11-28",
//     createdAt: "2024-09-01",
//   },
//   {
//     id: "5",
//     orgId: "org-002",
//     title: "International Driving Permit",
//     requirements: [
//       { text: "Valid driver’s license" },
//       { text: "Passport photo" },
//     ],
//     steps: [
//       { order: 1, text: "Submit application form" },
//       { order: 2, text: "Provide passport copy" },
//       { order: 3, text: "Collect international permit" },
//     ],
//     fees: [{ label: "Permit Fee", amount: 800, currency: "Birr" }],
//     processingTime: { minDays: 5, maxDays: 7 },
//     updatedAt: "2024-12-08",
//     createdAt: "2024-07-25",
//   },
// ];
// console.log(procedures)

export default function OrgProcedures() {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const [reload, setReload] = useState(false);

  // const triggerReload = () => setReload((prev) => !prev);

  const handleDelete = async (id: string) => {
    toast.success("Item deleted successfully!");
    await fetch(
      `https://ethio-guide-backend-dlwz.onrender.com/api/v1/procedures/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setReload((prev) => !prev);
  };
  const [procedures, setProcedures] = useState<ProcedureProp[]>([]);
  const [page, setPage] = useState(1);
  // const [totalProcedures, setTotalProcedures] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const userId = session?.user?.id;
  useEffect(() => {
    if (!userId) return; // wait until session loaded
    const fetchProcedures = async () => {
      try {
        const res = await fetch(
          `https://ethio-guide-backend-dlwz.onrender.com/api/v1/procedures?page=${page}&limit=${5}&organizationID=${userId}`
        );

        // const res = await fetch(
        //   `https://ethio-guide-backend-dlwz.onrender.com/api/v1/procedures`
        // );

        const data = await res.json();

        setProcedures(data.data);
        setTotalPages(Math.ceil(data.pagination.total / 5));
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProcedures();
  }, [page, userId, reload]);

  return (
    <div className="p-6 space-y-6 w-full">
      {/* Search + Filter Row */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-primary-dark">
          Procedure Management
        </h1>
        <Input placeholder="Search procedures..." className="max-w-sm" />
      </div>

      {/* Table */}
      <div className="border rounded-md shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-gray-600">
                Procedure Name
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">
                Last Updated
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 ">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {procedures.map((p) => (
              <tr key={p.id} className="border-b hover:bg-accent">
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-900">{p.name}</div>
                  <p className="text-sm text-muted-foreground text-neutral">
                    {p.content.result.length > 100
                      ? p.content.result.slice(0, 100) + "..."
                      : p.content.result}
                  </p>
                </td>
                <td className="py-3 px-4 text-neutral">
                  {new Date(p.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <TableCell className="flex space-x-2 mt-3">
                  {/* <FaEye className="w-4 h-4 text-primary cursor-pointer" /> */}
                  {/* <Link href={`/organization/procedures/${p.id}`}>
                    <BiSolidEdit className="w-4 h-4 text-primary mt-3 cursor-pointer" />
                  </Link> */}
                  <Link href={`/organization/procedures/${p.id}`}>
                    <Button className="p-2 bg-transparent hover:bg-blue-50 rounded-full transition-all duration-200 hover:scale-105">
                      <BiSolidEdit className="w-4 h-4 text-blue-600" />
                    </Button>
                  </Link>
                  <DeleteConfirmDialog
                    title="Delete Procedure"
                    description="This will permanently remove the procedure from your organization."
                    confirmLabel="Delete"
                    onConfirm={() => handleDelete(p.id)}
                  />
                </TableCell>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={(pagenum: number) => setPage(pagenum)}
        />
        {/* <div className="flex items-center justify-between p-4 text-sm text-gray-500">
          <span>Pages 1-{totalPages}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <Button variant="default" className="text-white" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div> */}
      </div>
    </div>
  );
}

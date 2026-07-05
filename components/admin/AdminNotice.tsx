"use client";
import { Card, CardContent } from "@/components/ui/card";
import { BiSolidEdit } from "react-icons/bi";
// import { FaEye } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import Notice from "@/types/notice";
import Link from "next/link";
// import { Trash2 } from "lucide-react";
import Pagination from "../shared/pagination";
import DeleteConfirmDialog from "../shared/AdminAndOrg/DeleteConfirmDialog";
import { useSession } from "next-auth/react";

export default function NoticeManagement() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [page, setPage] = useState(1);
  // const [totalNotice, setTotalNotice] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reload, setReload] = useState(false);
  const { data: session } = useSession();
  const token = session?.accessToken;
  // const userId = session?.user?.id;

  // console.log(notices);

  const handleDelete = async (id: string) => {
    // toast.success("Item deleted successfully!");
    await fetch(
      `https://ethio-guide-backend-dlwz.onrender.com/api/v1/notices/${id}`,
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

  useEffect(() => {
    const fetchsNotices = async () => {
      try {
        // const res = await fetch(`https://ethio-guide-backend-dlwz.onrender.com/api/v1/notices?page=${page}&limit=${5}`);
        const res = await fetch(
          `https://ethio-guide-backend-dlwz.onrender.com/api/v1/notices`
        );

        const data = await res.json();

        setNotices(data.data); // adjust to your API response
        // setTotalNotice(data.total); // if returned
        setTotalPages(Math.ceil(data.total / 5));
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchsNotices();
  }, [page, reload]); // <-- this will re-run whenever 'page' changes

  return (
    <div className="p-6 space-y-6 w-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-primary-dark">
          Notice Management
        </h1>
        <p className="text-muted-foreground text-sm text-neutral">
          Create, publish, and manage official notices for public communication
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <Input placeholder="Search notices by title..." className="md:w-1/3" />
        <label htmlFor="date" className="text-primary-dark">
          Publish date
        </label>
        <Input type="date" className="md:w-[200px]" name="date" />
      </div>

      {/* Table */}
      <Card className="shadow-sm overflow-x-auto">
        <CardContent>
          <div className="min-w-[700px]">
            <Table>
              <TableHeader>
                <TableRow className="text-neutral">
                  <TableHead>Notice Title</TableHead>
                  <TableHead>Publish Date</TableHead>
                  {/* <TableHead>Expiry Date</TableHead> */}
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {notices.map(
                  ({ id, title, content, created_at, updated_at }) => (
                    <TableRow key={id} className="hover:bg-accent">
                      <TableCell>
                        <p className="font-medium">{title}</p>
                        <p className="text-sm text-muted-foreground text-neutral">
                          {content?.length > 100
                            ? content.slice(0, 100) + "..."
                            : content}
                        </p>
                      </TableCell>
                      <TableCell className="text-neutral">
                        {new Date(created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-neutral">
                        {new Date(updated_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="flex space-x-2 mt-3">
                        {/* <FaEye className="w-4 h-4 text-primary cursor-pointer" /> */}
                        <Link href={`/admin/notices/edit/${id}`}>
                          <Button className="p-2 bg-transparent hover:bg-blue-50 rounded-full transition-all duration-200 hover:scale-105">
                            <BiSolidEdit className="w-4 h-4 text-blue-600" />
                          </Button>
                        </Link>
                        <DeleteConfirmDialog
                          title="Delete Notice"
                          description="This will permanently remove this notice from your organization."
                          confirmLabel="Delete"
                          onConfirm={() => handleDelete(id)}
                        />
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {/* Pagination */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(pagenum: number) => setPage(pagenum)}
      />

      {/* Create New Notice */}
      <div className="flex justify-end">
        <Link href="/admin/notices/create">
          <Button className="bg-primary hover:bg-primary-light text-white px-6 py-1 rounded-full flex items-center space-x-2">
            <span>+ Create New Notice</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}

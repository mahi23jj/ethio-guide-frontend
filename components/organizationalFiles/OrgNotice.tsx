"use client";

import Link from "next/link";
import { BiSolidEdit } from "react-icons/bi";
import { useDeleteNoticeMutation, useGetOrgNoticesQuery } from "@/app/services/orgsApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Notice from "@/types/notice";
import DeleteConfirmDialog from "../shared/AdminAndOrg/DeleteConfirmDialog";

export default function OrgNoticeMangement() {
  const orgId = "demo-org-id";
  const { data, isLoading, error, refetch } = useGetOrgNoticesQuery(orgId);
  const [deleteNotice] = useDeleteNoticeMutation();

  const notices = ((data as { notices?: Notice[] } | undefined)?.notices ?? []) as Notice[];

  const handleDelete = async (id: string) => {
    await deleteNotice({ orgId, noticeId: id }).unwrap();
    refetch();
  };

  return (
    <div className="w-full space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-primary-dark">
          Notice Management
        </h1>
        <p className="text-sm text-muted-foreground text-neutral">
          Create, publish, and manage official notices for public communication.
        </p>
      </div>

      <Card className="overflow-x-auto shadow-sm">
        <CardContent>
          <div className="min-w-[700px]">
            {isLoading ? (
              <div>Loading...</div>
            ) : error ? (
              <div className="text-red-500">Failed to load notices.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="text-neutral">
                    <TableHead>Notice Title</TableHead>
                    <TableHead>Publish Date</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="p-4 text-center">
                        No notices found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    notices.map((notice) => (
                      <TableRow key={notice.id} className="hover:bg-accent">
                        <TableCell>
                          <p className="font-medium text-primary-dark">
                            {notice.title}
                          </p>
                          <p className="text-sm text-muted-foreground text-neutral">
                            {notice.content?.length > 120
                              ? `${notice.content.slice(0, 120)}...`
                              : notice.content}
                          </p>
                        </TableCell>
                        <TableCell className="text-neutral">
                          {notice.created_at
                            ? new Date(notice.created_at).toLocaleDateString()
                            : "-"}
                        </TableCell>
                        <TableCell className="text-neutral">
                          {notice.updated_at
                            ? new Date(notice.updated_at).toLocaleDateString()
                            : "-"}
                        </TableCell>
                        <TableCell className="flex space-x-2 pt-3">
                          <Link href={`/organization/notices/edit/${notice.id}`}>
                            <Button className="rounded-full bg-transparent p-2 transition-all duration-200 hover:scale-105 hover:bg-blue-50">
                              <BiSolidEdit className="h-4 w-4 text-blue-600" />
                            </Button>
                          </Link>
                          <DeleteConfirmDialog
                            title="Delete Notice"
                            description="This will permanently remove this notice from your organization."
                            confirmLabel="Delete"
                            onConfirm={() => handleDelete(notice.id)}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

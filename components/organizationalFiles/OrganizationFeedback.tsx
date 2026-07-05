"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Pagination from "../shared/pagination";

import { Eye, Reply, Check, ThumbsUp } from "lucide-react";

// type for feedback coming from API
type Feedback = {
  id: string;
  content: string;
  procedure_id: string;
  created_at: string;
  like_count: number;
  status: string;
  type: string;
};

export default function OrganizationFeedback() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();
  const token = session?.accessToken;

  // 🔥 fetch feedback from API
  useEffect(() => {
    async function fetchFeedback() {
      setLoading(true);
      try {
        const res = await fetch(
          `https://ethio-guide-backend-1.onrender.com/api/v1/feedback?page=${page}&limit=${limit}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch feedback");

        const data = await res.json();
        setFeedbacks(data.feedbacks.feedbacks);
        setTotal(data.feedbacks.total);
        setLimit(data.feedbacks.limit);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (token) fetchFeedback();
  }, [page, limit, token]);

  // ✅ filter feedback by search
  const filtered = feedbacks.filter((f) =>
    f.content.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-100 text-blue-700">New</Badge>;
      case "reviewed":
        return (
          <Badge className="bg-yellow-100 text-yellow-700">Reviewed</Badge>
        );
      case "declined":
        return <Badge className="bg-red-100 text-red-700">Declined</Badge>;
      case "resolved":
        return <Badge className="bg-green-100 text-green-700">Resolved</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6 text-primary-dark">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">User Feedback</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage and respond to feedback submitted for your procedures
          </p>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Search feedback..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Feedback</TableHead>
                  <TableHead>Date</TableHead>
                  {/* <TableHead>Upvotes</TableHead> */}
                  <TableHead>Status</TableHead>
                  {/* <TableHead className="text-right">Actions</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  [...Array(limit)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={5}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filtered.length > 0 ? (
                  filtered.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg overflow-hidden whitespace-nowrap text-ellipsis">
                        <p className="font-medium" title={item.content}>
                          {item.content}
                        </p>
                      </TableCell>

                      <TableCell>
                        {new Date(item.created_at).toLocaleDateString()}
                      </TableCell>
                      {/* <TableCell className="flex items-center gap-2">
                        <ThumbsUp size={16} /> {item.like_count}
                      </TableCell> */}
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      {/* <TableCell className="flex gap-3 justify-end text-gray-600">
                        <Eye className="cursor-pointer hover:text-primary" />
                        <Reply className="cursor-pointer hover:text-primary" />
                        <Check className="cursor-pointer hover:text-primary" />
                      </TableCell> */}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No feedback found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {/* <div className="flex justify-between items-center mt-4"> */}
          {/* <p className="text-sm text-muted-foreground">
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, total)} of {total} results
            </p> */}
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
          {/* </div> */}
        </CardContent>
      </Card>
    </div>
  );
}

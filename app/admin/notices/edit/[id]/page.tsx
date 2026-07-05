"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, Upload, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Notice from "@/types/notice";

export default function EditNoticePage() {
  const { id } = useParams(); // notice ID from URL
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.accessToken;
  // const userId = session?.user?.id;

  // State
  const [notice, setNotice] = useState<Notice | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  // Fetch notice data
  useEffect(() => {
    if (!id) return;
    const fetchNotice = async () => {
      try {
        const res = await fetch(
          `https://ethio-guide-backend-dlwz.onrender.com/api/v1/notices`,
          {
            headers: {
              // Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch notice");
        const data = await res.json();
        console.log("Fetched notice:", data);
        const found = data.data.find((n: Notice) => n.id === id);
        setNotice(found || null);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotice();
  }, [id, token]);

  // Populate form fields
  useEffect(() => {
    if (notice) {
      setTitle(notice.title);
      setContent(notice.content);
      setTags(notice.tags || []);
    }
  }, [notice]);

  // Handle update
  const handleUpdate = async () => {
    if (!id) return;
    const payload = {
      id,
      title,
      content,
      tags,
      updated_at: new Date().toISOString(),
    };

    try {
      const res = await fetch(
        `https://ethio-guide-backend-dlwz.onrender.com/api/v1/notices/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Failed to update notice");

      // alert("Notice updated successfully!");
      router.replace("/admin/notices"); // go back to list
    } catch (err) {
      console.error(err);
      alert("Error updating notice.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/notices">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Edit Official Notice
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg shadow-slate-200/50">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700 tracking-wide">
                    Notice Title
                  </label>
                  <Input
                    placeholder="Enter notice title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-white/80 border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 h-12 text-base placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700 tracking-wide">
                    Notice Description
                  </label>
                  <Textarea
                    placeholder="Enter notice description..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="border border-slate-200 rounded-xl p-3 resize-none min-h-32 focus-visible:ring-0 text-base placeholder:text-slate-400 bg-white/80"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Update button */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                onClick={handleUpdate}
                className="bg-[#3A6A8D] hover:bg-[#2d5470] text-white shadow-lg h-12 px-6 font-semibold tracking-wide"
              >
                <Upload className="h-4 w-4 mr-2" />
                Update Notice
              </Button>
              <Button
                variant="outline"
                className="text-slate-600 border-slate-300 hover:bg-slate-50 h-12 px-6 font-medium bg-transparent"
              >
                Cancel
              </Button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-xl sticky top-24">
              <CardHeader className="pb-4 border-b border-slate-100">
                <CardTitle className="flex items-center gap-3 text-lg text-slate-800">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Eye className="h-4 w-4 text-blue-600" />
                  </div>
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <h3 className="font-bold text-slate-900 text-lg leading-tight">
                  {title || "Sample Notice Title"}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {content ||
                    "This is how your notice description will appear to users."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { FormEvent, useState } from "react";
import { Building, FileText, Megaphone, Plus } from "lucide-react";
import { FaUsers } from "react-icons/fa6";
import { MdOutlineFeedback } from "react-icons/md";
import { Button } from "@/components/ui/button";
import {
  useCreateNoticeMutation,
  useCreateProcedureMutation,
} from "@/app/services/orgsApi";

interface OrgDashboardProps {
  totalProcedures: number;
  totalNotices: number;
}

export default function OrgDashboard({
  totalProcedures,
  totalNotices,
}: OrgDashboardProps) {
  const [showProcedureModal, setShowProcedureModal] = useState(false);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [procedureForm, setProcedureForm] = useState({
    title: "",
    description: "",
  });
  const [noticeForm, setNoticeForm] = useState({ title: "", content: "" });

  const [createProcedure, { isLoading: isCreatingProcedure }] =
    useCreateProcedureMutation();
  const [createNotice, { isLoading: isCreatingNotice }] =
    useCreateNoticeMutation();

  const orgId = "demo-org-id";

  const stats = [
    {
      data: totalProcedures,
      description: "Procedures Managed",
      icon: (
        <div className="rounded-2xl bg-gray-100 p-3">
          <FileText className="mb-2 h-6 w-6 text-[#3A6A8D]" />
        </div>
      ),
    },
    {
      data: totalNotices,
      description: "Active Notices",
      icon: (
        <div className="rounded-2xl bg-gray-100 p-3">
          <Megaphone className="mb-2 h-6 w-6 text-[#5E9C8D]" />
        </div>
      ),
    },
    {
      data: "-",
      description: "Pending Feedback",
      icon: (
        <div className="rounded-2xl bg-gray-100 p-3">
          <MdOutlineFeedback className="mb-2 h-6 w-6 text-[#1C3B2E]" />
        </div>
      ),
    },
    {
      data: "-",
      description: "User Interactions",
      icon: (
        <div className="rounded-2xl bg-gray-100 p-3">
          <FaUsers className="mb-2 h-6 w-6 text-[#1C3B2E]" />
        </div>
      ),
    },
  ];

  const handleProcedureSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await createProcedure({ orgId, ...procedureForm }).unwrap();
      setShowProcedureModal(false);
      setProcedureForm({ title: "", description: "" });
      alert("Procedure created!");
    } catch {
      alert("Failed to create procedure");
    }
  };

  const handleNoticeSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await createNotice({ orgId, ...noticeForm }).unwrap();
      setShowNoticeModal(false);
      setNoticeForm({ title: "", content: "" });
      alert("Notice created!");
    } catch {
      alert("Failed to create notice");
    }
  };

  return (
    <div className="w-full space-y-6 p-6">
      <div className="relative overflow-hidden rounded-2xl bg-[#3A6A8D] px-6 py-10 text-white shadow">
        <h1 className="text-2xl font-semibold">Organization dashboard</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/80">
          Track procedures and notices from one place.
        </p>
        <Building className="absolute right-5 top-5 size-20 text-white/25" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.description}
            className="rounded-2xl border bg-white p-5 shadow-sm"
          >
            <div className="mb-4">{stat.icon}</div>
            <div className="text-3xl font-semibold text-slate-900">
              {stat.data}
            </div>
            <div className="mt-1 text-sm text-slate-500">
              {stat.description}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4">
        <Button
          className="flex items-center gap-2 bg-[#3A6A8D] text-white hover:bg-[#5C87A3]"
          onClick={() => setShowProcedureModal(true)}
        >
          <Plus className="h-4 w-4" />
          <span>Add New Procedure</span>
        </Button>
        <Button
          className="flex items-center gap-2 bg-[#5E9C8D] text-white hover:bg-[#7FB4A6]"
          onClick={() => setShowNoticeModal(true)}
        >
          <Megaphone className="h-4 w-4" />
          <span>Create Notice</span>
        </Button>
      </div>

      {showProcedureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">Add New Procedure</h2>
            <form onSubmit={handleProcedureSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Title</label>
                <input
                  className="w-full rounded border px-3 py-2"
                  placeholder="Procedure title"
                  value={procedureForm.title}
                  onChange={(event) =>
                    setProcedureForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Description
                </label>
                <textarea
                  className="w-full rounded border px-3 py-2"
                  placeholder="Procedure description"
                  value={procedureForm.description}
                  onChange={(event) =>
                    setProcedureForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowProcedureModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreatingProcedure}>
                  {isCreatingProcedure ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">Create Notice</h2>
            <form onSubmit={handleNoticeSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Title</label>
                <input
                  className="w-full rounded border px-3 py-2"
                  placeholder="Notice title"
                  value={noticeForm.title}
                  onChange={(event) =>
                    setNoticeForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Content</label>
                <textarea
                  className="w-full rounded border px-3 py-2"
                  placeholder="Notice content"
                  value={noticeForm.content}
                  onChange={(event) =>
                    setNoticeForm((current) => ({
                      ...current,
                      content: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNoticeModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreatingNotice}>
                  {isCreatingNotice ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

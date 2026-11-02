"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminDashboardClient() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadComplaints() {
      try {
        const res = await fetch("/api/complaints", {
          cache: "no-store",
        });

        if (res.status === 401) {
          router.replace("/admin/login");
          return;
        }

        const data = await res.json();

        if (!res.ok || !data.success) {
          console.error("Failed to fetch complaints:", data);
          return;
        }

        setComplaints(Array.isArray(data.complaints) ? data.complaints : []);
      } catch (error) {
        console.error("Dashboard complaint loading error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadComplaints();
  }, [router]);

  const total = complaints.length;

  const pending = complaints.filter(
    (c) => c.status === "Pending"
  ).length;

  const review = complaints.filter(
    (c) => c.status === "Under Review"
  ).length;

  const resolved = complaints.filter(
    (c) => c.status === "Resolved"
  ).length;

  const filteredComplaints = complaints.filter((item) => {
    const query = search.trim().toLowerCase();

    const complaintId = String(item.complaintId ?? "").toLowerCase();
    const subject = String(item.subject ?? "").toLowerCase();

    const matchesSearch =
      complaintId.includes(query) || subject.includes(query);

    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (complaintId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/complaints/${complaintId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }

      if (res.ok) {
        setComplaints((prev) =>
          prev.map((c) =>
            c.complaintId === complaintId ? { ...c, status: newStatus } : c
          )
        );

        if (selectedComplaint && selectedComplaint.complaintId === complaintId) {
          setSelectedComplaint((prev: any) => ({
            ...prev,
            status: newStatus,
          }));
        }
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout request error:", error);
    }
    window.location.href = "/admin/login";
  };

  return (
    <>
      <div className="min-h-screen bg-[#F8FAF8] text-[#111827] p-4 sm:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2EBE5]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1B4332] text-white flex items-center justify-center shadow-md shadow-[#1B4332]/20">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B4332] tracking-tight">
                  Admin Dashboard
                </h1>
                <p className="text-xs text-[#6B7280]">
                  Grievance Redressal & Public Portal Oversight
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="/"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#1B4332] hover:bg-[#E8F5E9] bg-white border border-[#E2EBE5] transition-all shadow-xs"
              >
                <svg
                  className="w-4 h-4 text-[#2D6A4F]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to ARCA Website
              </a>

              <button
                onClick={handleLogout}
                className="bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            <div className="bg-white rounded-3xl p-6 border border-[#E2EBE5] shadow-[0_4px_16px_-2px_rgba(27,67,50,0.04)]">
              <p className="text-[#6B7280] text-xs font-bold uppercase tracking-wider mb-1">Total Complaints</p>
              <h2 className="text-3xl sm:text-4xl font-black text-[#1B4332]">{total}</h2>
            </div>

            <div className="bg-amber-50/70 rounded-3xl p-6 border border-amber-200/80 shadow-[0_4px_16px_-2px_rgba(217,119,6,0.04)]">
              <p className="text-amber-800 text-xs font-bold uppercase tracking-wider mb-1">Pending</p>
              <h2 className="text-3xl sm:text-4xl font-black text-amber-900">{pending}</h2>
            </div>

            <div className="bg-sky-50/70 rounded-3xl p-6 border border-sky-200/80 shadow-[0_4px_16px_-2px_rgba(2,132,199,0.04)]">
              <p className="text-sky-800 text-xs font-bold uppercase tracking-wider mb-1">Under Review</p>
              <h2 className="text-3xl sm:text-4xl font-black text-sky-900">{review}</h2>
            </div>

            <div className="bg-[#E8F5E9]/90 rounded-3xl p-6 border border-[#AEEECB] shadow-[0_4px_16px_-2px_rgba(27,67,50,0.04)]">
              <p className="text-[#1B4332] text-xs font-bold uppercase tracking-wider mb-1">Resolved</p>
              <h2 className="text-3xl sm:text-4xl font-black text-[#1B4332]">{resolved}</h2>
            </div>
          </div>

          {/* Complaints Table Container */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2EBE5] shadow-[0_8px_24px_-4px_rgba(27,67,50,0.06)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#111827]">All Complaints</h2>
                <p className="text-xs text-[#6B7280]">Review, update status, and manage logged citizen grievances</p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#F8FAF8] border border-[#E2EBE5] rounded-xl px-3.5 py-2 text-xs font-bold text-[#111827] focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#D8F3DC] transition-all cursor-pointer shadow-xs"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>

            <div>
              <input
                type="text"
                placeholder="🔍 Search by Complaint ID or Subject..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#F8FAF8] border border-[#E2EBE5] rounded-xl px-4 py-2.5 text-xs text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#D8F3DC] transition-all shadow-xs"
              />
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[#E2EBE5]">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#E2EBE5] bg-[#F8FAF8] text-[#4B5563] text-xs font-bold uppercase tracking-wider">
                    <th className="p-3.5">Complaint ID</th>
                    <th className="p-3.5">Subject</th>
                    <th className="p-3.5">Authority</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E2EBE5]">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-xs font-medium text-[#6B7280]">
                        Loading complaints...
                      </td>
                    </tr>
                  ) : filteredComplaints.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-xs font-medium text-[#6B7280]">
                        No complaints found.
                      </td>
                    </tr>
                  ) : (
                    filteredComplaints.map((item) => (
                      <tr
                        key={item._id}
                        className="hover:bg-[#F8FAF8] transition-colors"
                      >
                        <td className="p-3.5 font-mono text-xs font-bold text-[#1B4332]">{item.complaintId}</td>
                        <td className="p-3.5 text-xs text-[#111827] font-medium max-w-xs truncate">{item.subject}</td>
                        <td className="p-3.5 text-xs text-[#4B5563]">{item.authority}</td>
                        <td className="p-3.5">
                          <select
                            value={item.status}
                            onChange={(e) =>
                              handleStatusChange(item.complaintId, e.target.value)
                            }
                            className={`rounded-lg px-2.5 py-1 border text-xs font-bold focus:outline-none cursor-pointer ${
                              item.status === "Resolved"
                                ? "bg-[#E8F5E9] text-[#2D6A4F] border-[#AEEECB]"
                                : item.status === "Under Review"
                                ? "bg-sky-50 text-sky-700 border-sky-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        </td>
                        <td className="p-3.5">
                          <button
                            onClick={() => {
                              setSelectedComplaint(item);
                              setShowModal(true);
                            }}
                            className="bg-[#1B4332] hover:bg-[#2D6A4F] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-[700px] max-w-full rounded-3xl p-6 sm:p-8 border border-[#E2EBE5] shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-[#E2EBE5]">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#1B4332]">
                  Complaint Details
                </h2>
                <p className="text-xs text-[#6B7280]">Official citizen grievance record</p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-[#F4F7F4] hover:bg-[#EAEFEA] text-[#4B5563] hover:text-[#111827] flex items-center justify-center text-sm font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <p className="text-[#6B7280] font-bold uppercase tracking-wider text-[10px]">Complaint ID</p>
                <p className="font-mono text-[#1B4332] text-sm font-bold">{selectedComplaint.complaintId}</p>
              </div>

              <div>
                <p className="text-[#6B7280] font-bold uppercase tracking-wider text-[10px]">Authority</p>
                <p className="text-[#111827] font-semibold text-sm">{selectedComplaint.authority}</p>
              </div>

              <div>
                <p className="text-[#6B7280] font-bold uppercase tracking-wider text-[10px]">Subject</p>
                <p className="text-[#111827] font-semibold text-sm">{selectedComplaint.subject}</p>
              </div>

              <div>
                <p className="text-[#6B7280] font-bold uppercase tracking-wider text-[10px]">Complaint Body</p>
                <p className="whitespace-pre-wrap text-[#374151] bg-[#F8FAF8] p-3.5 rounded-xl border border-[#E2EBE5] text-xs leading-relaxed font-sans mt-1">
                  {selectedComplaint.body}
                </p>
              </div>

              <div>
                <p className="text-[#6B7280] font-bold uppercase tracking-wider text-[10px]">Original User Input</p>
                <p className="whitespace-pre-wrap text-[#374151] bg-[#F8FAF8] p-3.5 rounded-xl border border-[#E2EBE5] text-xs leading-relaxed font-sans mt-1">
                  {selectedComplaint.userInput}
                </p>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <div>
                  <p className="text-[#6B7280] font-bold uppercase tracking-wider text-[10px]">Status</p>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold border ${
                    selectedComplaint.status === "Resolved"
                      ? "bg-[#E8F5E9] text-[#2D6A4F] border-[#AEEECB]"
                      : selectedComplaint.status === "Under Review"
                      ? "bg-sky-50 text-sky-700 border-sky-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}>
                    {selectedComplaint.status}
                  </span>
                </div>

                <div>
                  <p className="text-[#6B7280] font-bold uppercase tracking-wider text-[10px]">Created At</p>
                  <p className="text-[#4B5563] mt-1 font-medium">
                    {new Date(selectedComplaint.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

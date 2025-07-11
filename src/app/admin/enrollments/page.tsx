"use client";

import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";

interface Enrollment {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
  };
  course: {
    id: number;
    title: string;
    instructor: string;
  };
}

export default function EnrollmentPage() {
  const { loading } = useAuthRedirect(); // ✅ access check
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [error, setError] = useState("");
  const [dataLoading, setDataLoading] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!loading) {
      fetchEnrollments();
    }
  }, [loading]);

  const fetchEnrollments = async () => {
    setDataLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/admin/enrollments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch enrollments");

      const data = await res.json();
      setEnrollments(data);
    } catch (err: any) {
      setError(err.message || "Error fetching enrollments");
    } finally {
      setDataLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to de-enroll this student?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/admin/enrollments/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete enrollment");

      setEnrollments((prev) => prev.filter((e) => e.id !== id));
      toast.success("Enrollment removed successfully!");
    } catch (err: any) {
      toast.error(err.message || "Error deleting enrollment");
    }
  };

  // ✅ Block render until auth role is confirmed
  if (loading) {
    return <div className="text-center text-white mt-32 text-xl">Checking access...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1f1f1f] text-white px-6 pt-32 pb-12">
      <Navbar />
      <h1 className="text-4xl font-bold text-center mb-10">📚 Admin Enrollment Dashboard</h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {dataLoading && <p className="text-center text-gray-400">Loading enrollments...</p>}

      {!dataLoading && enrollments.length === 0 && !error && (
        <p className="text-center text-gray-400">No enrollments found.</p>
      )}

      {enrollments.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-gray-700 shadow-lg">
          <table className="w-full text-left border-collapse bg-gray-900 text-sm">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-4 border border-gray-700">#</th>
                <th className="px-6 py-4 border border-gray-700">Student</th>
                <th className="px-6 py-4 border border-gray-700">Email</th>
                <th className="px-6 py-4 border border-gray-700">Course Title</th>
                <th className="px-6 py-4 border border-gray-700">Instructor</th>
                <th className="px-6 py-4 border border-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((enr) => (
                <tr key={enr.id} className="hover:bg-gray-800 transition">
                  <td className="px-6 py-4 border border-gray-700">{enr.id}</td>
                  <td className="px-6 py-4 border border-gray-700">{enr.user.username}</td>
                  <td className="px-6 py-4 border border-gray-700">{enr.user.email}</td>
                  <td className="px-6 py-4 border border-gray-700">{enr.course.title}</td>
                  <td className="px-6 py-4 border border-gray-700">{enr.course.instructor}</td>
                  <td className="px-6 py-4 border border-gray-700">
                    <button
                      onClick={() => handleDelete(enr.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Drop out
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

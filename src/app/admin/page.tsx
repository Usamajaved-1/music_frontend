"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import Navbar from "@/components/Navbar";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import toast from "react-hot-toast";

interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  instructor: string;
  is_featured: boolean;
  image: string;
}

export default function AdminCoursePage() {
  const { loading } = useAuthRedirect(); // ✅ get loading from hook
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editCourseId, setEditCourseId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    instructor: '',
    is_featured: false,
    image: '',
  });

  useEffect(() => {
    if (!loading) {
      fetchCourses();
    }
  }, [loading]);

  const fetchCourses = async () => {
    try {
      const res = await fetchWithAuth('http://127.0.0.1:8000/courses');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      setError('Failed to load courses');
    }
  };

  const deleteCourse = async (id: number) => {
    if (!confirm("Are you sure to delete this course?")) return;
    try {
      const res = await fetchWithAuth(`http://127.0.0.1:8000/courses/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success("Deleted successfully");
      fetchCourses();
    } catch {
      toast.error("Failed to delete course");
    }
  };

  const handleCreateCourse = async () => {
    try {
      const res = await fetchWithAuth(`http://127.0.0.1:8000/courses`, {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });

      if (!res.ok) throw new Error();
      resetForm();
      fetchCourses();
      toast.success("Course created!");
    } catch {
      toast.error("Course creation failed.");
    }
  };

  const handleUpdateCourse = async () => {
    if (!editCourseId) return;

    try {
      const res = await fetchWithAuth(`http://127.0.0.1:8000/courses/${editCourseId}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });

      if (!res.ok) throw new Error();
      resetForm();
      fetchCourses();
      toast.success("Course updated!");
    } catch {
      toast.error("Course update failed.");
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditCourseId(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      instructor: '',
      is_featured: false,
      image: '',
    });
  };

  // ✅ BLOCK page render until auth is confirmed
  if (loading) {
    return <div className="text-center text-white mt-32 text-xl">Checking access...</div>;
  }

  return (
    <div className="min-h-screen bg-black py-12 pt-36 text-white">
      <Navbar />
      <h1 className="text-4xl md:text-6xl text-center font-bold mb-6">
        Admin Course Dashboard ({courses.length})
      </h1>

      <div className="flex justify-center gap-4 mb-8">
        <button
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white font-semibold"
          onClick={() => {
            setShowForm(true);
            setEditCourseId(null);
          }}
        >
          + Create New Course
        </button>

        <a
          href="/admin/enrollments"
          className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded text-white font-semibold"
        >
          📋 View Enrollments
        </a>
      </div>

      {showForm && (
        <div className="max-w-xl mx-auto bg-white text-black p-6 rounded shadow mb-10">
          <h2 className="text-xl font-semibold mb-4">
            {editCourseId ? "Edit Course" : "Create New Course"}
          </h2>
          <input
            type="text"
            placeholder="Title"
            className="w-full border p-2 mb-2 rounded"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <textarea
            placeholder="Description"
            className="w-full border p-2 mb-2 rounded"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <input
            type="text"
            placeholder="Instructor"
            className="w-full border p-2 mb-2 rounded"
            value={formData.instructor}
            onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            className="w-full border p-2 mb-2 rounded"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
          <input
            type="text"
            placeholder="Image URL"
            className="w-full border p-2 mb-2 rounded"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          />
          <label className="block mb-2">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
            />
            <span className="ml-2">Featured Course?</span>
          </label>
          <div className="flex gap-3 mt-4">
            {editCourseId ? (
              <button onClick={handleUpdateCourse} className="bg-yellow-600 px-4 py-2 text-white rounded">
                Update
              </button>
            ) : (
              <button onClick={handleCreateCourse} className="bg-green-600 px-4 py-2 text-white rounded">
                Create
              </button>
            )}
            <button onClick={resetForm} className="bg-gray-500 px-4 py-2 text-white rounded">Cancel</button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap justify-center">
        {courses.map((course) => (
          <CardContainer key={course.id} className="inter-var m-4">
            <CardBody className="bg-gray-50 dark:bg-black border w-[22rem] rounded-xl p-6">
              <CardItem translateZ="50" className="text-lg font-bold dark:text-white">{course.title}</CardItem>
              <CardItem translateZ="60" className="text-neutral-400 text-sm mt-2">{course.description}</CardItem>
              <CardItem translateZ="100" className="w-full mt-4">
                <Image
                  src={course.image ? `/${course.image.replace(/\\/g, '/')}` : '/placeholder.png'}
                  height={1000}
                  width={1000}
                  className="h-48 w-full object-cover rounded-xl"
                  alt={course.title}
                />
              </CardItem>
              <div className="flex justify-between items-center mt-6">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                  onClick={() => {
                    setEditCourseId(course.id);
                    setShowForm(true);
                    setFormData({
                      title: course.title,
                      description: course.description,
                      price: course.price.toString(),
                      instructor: course.instructor,
                      is_featured: course.is_featured,
                      image: course.image || '',
                    });
                  }}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => deleteCourse(course.id)}
                >
                  Delete
                </button>
              </div>
            </CardBody>
          </CardContainer>
        ))}
      </div>
    </div>
  );
}

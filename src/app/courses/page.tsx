'use client';
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useEffect, useState } from "react";
import Image from "next/image";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import Navbar from "@/components/Navbar";
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

interface Enrollment {
  course: {
    id: number;
  };
}

export default function Page() {
  useAuthRedirect();

  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<number[]>([]);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    fetchCourses();
    if (token) fetchEnrolledCourses();
  }, [token]);

  const fetchCourses = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/courses');
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      toast.error("Failed to load courses");
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/enrollments/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      const ids = data.map((enrollment: Enrollment) => enrollment.course.id);
      setEnrolledCourseIds(ids);
    } catch (err) {
      toast.error("Failed to load enrolled courses");
    }
  };

  const enrollCourse = async (courseId: number) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/enroll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ course_id: courseId }),
      });

      if (res.status === 400) {
        const err = await res.json();
        toast.error(err.detail || "Already enrolled.");
        return;
      }

      if (!res.ok) throw new Error();

      toast.success("Enrolled successfully!");
      setEnrolledCourseIds((prev) => [...prev, courseId]); // ✅ Update state
    } catch {
      toast.error("Enrollment failed. Make sure you're logged in as a student.");
    }
  };

  return (
    <div className="min-h-screen bg-black py-12 pt-36 text-white">
      <Navbar />
      <h1 className="text-4xl md:text-6xl text-center font-bold mb-12">
        Available Courses ({courses.length})
      </h1>

      <div className="flex flex-wrap justify-center">
        {courses.map((course) => {
          const isEnrolled = enrolledCourseIds.includes(course.id);
          return (
            <CardContainer key={course.id} className="inter-var m-4">
              <CardBody className="bg-gray-50 dark:bg-black border w-[22rem] rounded-xl p-6">
                <CardItem translateZ="50" className="text-lg font-bold dark:text-white">{course.title}</CardItem>
                <CardItem translateZ="60" className="text-neutral-400 text-sm mt-2">{course.description}</CardItem>
                <CardItem translateZ="100" className="w-full mt-4">
                  <Image
                    src={`/${course.image.replace(/\\/g, '/') || 'placeholder.png'}`}
                    height={1000}
                    width={1000}
                    className="h-48 w-full object-cover rounded-xl"
                    alt={course.title}
                  />
                </CardItem>
                <div className="mt-6">
                  <button
                    className={`w-full py-2 rounded ${
                      isEnrolled
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                    disabled={isEnrolled}
                    onClick={() => enrollCourse(course.id)}
                  >
                    {isEnrolled ? "Enrolled" : "Enroll Now"}
                  </button>
                </div>
              </CardBody>
            </CardContainer>
          );
        })}
      </div>
    </div>
  );
}


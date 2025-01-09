import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllAdminCoursesQuery } from "../../../features/api/courseApi";

const CourseTable: React.FC = () => {
  const { data, isLoading } = useGetAllAdminCoursesQuery();
  const navigate = useNavigate();

  if (isLoading) {
    return <h3 className="text-xl font-semibold text-center">Loading...</h3>;
  }

  const courses = data?.courses ?? [];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Create Course Button */}
      <div className="mb-4 flex justify-end">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          onClick={() => navigate("create")}
        >
          Create a new course
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded shadow-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">Price</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">Status</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">Title</th>
              <th className="px-4 py-2 text-right font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {courses.length > 0 ? (
              courses.map((course: any) => (
                <tr
                  key={course._id}
                  className="border-b last:border-none hover:bg-gray-100"
                >
                  <td className="px-4 py-2 text-gray-800">
                    {course.coursePrice ? `$${course.coursePrice}` : "NA"}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block px-3 py-1 text-sm font-semibold rounded ${
                        course.isPublished
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {course.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-800">{course.courseTitle}</td>
                  <td className="px-4 py-2 text-right">
                    <button
                      className="text-blue-500 hover:text-blue-700 font-semibold flex items-center"
                      onClick={() => navigate(course._id)}
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M17.414 2.586a2 2 0 010 2.828l-10 10a2 2 0 01-.707.414l-4 1a1 1 0 01-1.213-1.213l1-4a2 2 0 01.414-.707l10-10a2 2 0 012.828 0zM15.586 4L5 14.586 4 17l2.414-1L16 6.414 15.586 4z"></path>
                      </svg>
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-2 text-center text-gray-500"
                >
                  No courses available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseTable;

import { Skeleton, Card, Badge } from "antd";
import React from "react";
import { useGetPublishedCourseQuery } from "../../features/api/courseApi";
import Course from "./course";

const Courses = () => {
  const { data, isLoading, isError } = useGetPublishedCourseQuery();

  if (isLoading) return <h1>Loading.....</h1>;
  if (isError) return <h1>Error fetching courses</h1>;

  // Since data is of type PublishedCoursesResponse, courses will be available.
  const courses = data?.courses ?? [];
  console.log(courses);

  return (
    <div className="bg-gray-50 dark:bg-[#141414]">
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="font-bold text-3xl text-center mb-10">Our Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.length === 0 ? (
            Array.from({ length: 8 }).map((_, index) => (
              <CourseSkeleton key={index} />
            ))
          ) : (
            courses.map((course) => <Course key={course._id} course={course} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;

const CourseSkeleton = () => {
  return (
    <Card
      className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden"
      loading
      bordered={false}
      bodyStyle={{ padding: 0 }}
    >
      <Skeleton.Image className="w-full h-36" />
      <div className="px-5 py-4 space-y-3">
        <Skeleton.Input className="h-6 w-3/4" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton.Avatar className="h-6 w-6 rounded-full" />
            <Skeleton.Input className="h-4 w-20" />
          </div>
          <Skeleton.Input className="h-4 w-16" />
        </div>
        <Skeleton.Input className="h-4 w-1/4" />
      </div>
    </Card>
  );
};

// const Course = ({ course }: { course: any }) => {
//   console.log(course, "course")
//   return (
//     <Card
//       className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden"
//       hoverable
//       cover={<img alt={course.courseTitle} src={course.courseThumbnail} />}
//       bodyStyle={{ padding: "16px" }}
//     >
//       <h3 className="text-lg font-semibold">{course.courseTitle}</h3>
//       <div className="flex items-center justify-between mt-3">
//         <div className="flex items-center gap-2">
//           <Badge
//             count={course.instructor ? <img src={course.creator.photoUrl} alt="instructor" className="h-6 w-6 rounded-full" /> : null}
//             style={{ backgroundColor: "#52c41a" }}
//           />
//           <span>{course.creator?.name}</span>
//         </div>
//         <div className="text-right">
//           <span>{course.coursePrice ? `$${course.coursePrice}` : "Free"}</span>
//         </div>
//       </div>
//     </Card>
//   );
// };
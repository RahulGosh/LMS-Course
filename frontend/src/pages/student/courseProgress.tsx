import { Badge } from "antd"; // Import Badge from Ant Design
import { Button } from "antd"; // Import Button from Ant Design
import { Card } from "antd"; // Import Card from Ant Design
import {
  useGetCourseProgressQuery,
  useMarkAsCompletedMutation,
  useMarkAsInCompletedMutation,
  useUpdateLectureProgressMutation,
} from "../../features/api/progressApi";
import { Lecture } from "../../types/types";
import { CheckCircle, CheckCircle2, CirclePlay } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CourseProgress = () => {
  const params = useParams<{ courseId: string }>();
  const courseId = params.courseId || "";

  const { data, refetch } = useGetCourseProgressQuery(courseId, {
    skip: !courseId,
  });
  const [updateLectureProgress] = useUpdateLectureProgressMutation();

  const [
    markAsCompleted,
    { data: markAsCompletedData, isSuccess: markAsCompletedSuccess },
  ] = useMarkAsCompletedMutation();

  const [
    markAsInCompleted,
    { data: markAsInCompletedData, isSuccess: markAsInCompletedSuccess },
  ] = useMarkAsInCompletedMutation();

  // useEffect(() => {
  //   console.log(markAsCompletedData);

  //   if (markAsCompletedSuccess) {
  //     refetch();
  //     toast.success(markAsCompletedData.message);
  //   }
  //   if (markAsInCompletedSuccess) {
  //     refetch();
  //     toast.success(markAsInCompletedData.message);
  //   }
  // }, [markAsCompletedSuccess, markAsInCompletedSuccess]);

  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);

  const { courseDetails, progress, completed } = data?.data || {};
  const { courseTitle, lectures } = courseDetails || {};
  console.log(data?.data?.courseDetails, "data?.data?.courseDetails");
  const initialLecture = currentLecture || (lectures && lectures[0]);

  const isLectureCompleted = (lectureId: string): boolean => {
    return !!progress?.some(
      (prog) => prog.lectureId === lectureId && prog.viewed
    );
  };

  const handleLectureProgress = async (lectureId: string | undefined) => {
    if (!lectureId) return; // Ensure lectureId is defined before proceeding
    await updateLectureProgress({ courseId, lectureId });
    refetch();
  };

  const handleSelectLecture = (lecture: Lecture) => {
    setCurrentLecture(lecture);
    if (lecture._id) {
      handleLectureProgress(lecture?._id);
    }
  };

  const handleCompleteCourse = async () => {
    await markAsCompleted({ courseId });
  };

  const handleInCompleteCourse = async () => {
    await markAsInCompleted({ courseId });
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Display course name  */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">{courseTitle}</h1>
        <Button
          onClick={completed ? handleInCompleteCourse : handleCompleteCourse}
          type={completed ? "dashed" : "primary"}
        >
          {completed ? (
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" /> <span>Completed</span>{" "}
            </div>
          ) : (
            "Mark as completed"
          )}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Video section  */}
        <div className="flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4">
          <div>
            <video
              src={currentLecture?.videoUrl || initialLecture?.videoUrl}
              controls
              className="w-full h-auto md:rounded-lg"
              onPlay={() =>
                handleLectureProgress(
                  currentLecture?._id || initialLecture?._id
                )
              }
            />
          </div>
          {/* Display current watching lecture title */}
          <div className="mt-2 ">
            <h3 className="font-medium text-lg">
              {`Lecture ${
                (courseDetails?.lectures?.findIndex(
                  (lec) =>
                    lec._id === (currentLecture?._id || initialLecture?._id)
                ) ?? -1) + 1
              } : ${
                currentLecture?.lectureTitle ||
                initialLecture?.lectureTitle ||
                "No Title"
              }`}
            </h3>
          </div>
        </div>
        {/* Lecture Sidebar  */}
        <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0">
          <h2 className="font-semibold text-xl mb-4">Course Lecture</h2>
          <div className="flex-1 overflow-y-auto">
            {courseDetails?.lectures?.map((lecture) => (
              <Card
                key={lecture._id}
                className={`mb-3 hover:cursor-pointer transition transform ${
                  lecture._id === currentLecture?._id
                    ? "bg-gray-200 dark:bg-gray-800"
                    : ""
                } `}
                onClick={() => handleSelectLecture(lecture)}
              >
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    {isLectureCompleted(lecture._id) ? (
                      <CheckCircle2 size={24} className="text-green-500 mr-2" />
                    ) : (
                      <CirclePlay size={24} className="text-gray-500 mr-2" />
                    )}
                    <div>
                      <h3 className="text-lg font-medium">
                        {lecture?.lectureTitle}
                      </h3>
                    </div>
                  </div>
                  {isLectureCompleted(lecture._id) && (
                    <Badge
                      className="bg-green-200 text-green-600"
                      status="success"
                    >
                      Completed
                    </Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;

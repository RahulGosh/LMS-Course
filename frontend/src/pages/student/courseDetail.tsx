import React from "react";
import { Button, Card, Avatar, Badge, Typography, Divider, Row, Col } from "antd";
import { LockOutlined, PlayCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import ReactPlayer from "react-player";
import { useNavigate, useParams } from "react-router-dom";
import { useGetCourseDetailWithStatusQuery } from "../../features/api/purchaseApi";
import { Lecture } from "../../types/types";
import BuyCourseButton from "../../components/buyCourseButton";

const { Title, Text } = Typography;

const CourseDetail: React.FC = () => {
  const params = useParams<{ courseId: string }>();
  const courseId = params.courseId || "";
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetCourseDetailWithStatusQuery(courseId, {
    skip: !courseId,
  });

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1>Failed to load course details</h1>;

  const course = data?.course;
  const purchased = data?.purchased;

  const handleContinueCourse = () => {
    if (purchased) {
      navigate(`/course-progress/${courseId}`);
    }
  };

  return (
    <div className="space-y-5">
      {/* Course Header */}
      <div className="bg-[#2D2F31] text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
          <Title level={2}>{course?.courseTitle || "Course Title"}</Title>
          <Text className="text-base md:text-lg">{course?.subTitle || "Course Sub-title"}</Text>
          <p>
            Created By{" "}
            <span className="text-[#C0C4FC] underline italic">
              {course?.creator?.name || "Unknown Creator"}
            </span>
          </p>
          <div className="flex items-center gap-2 text-sm">
            <InfoCircleOutlined style={{ fontSize: 16 }} />
            <Text>
              Last updated{" "}
              {course?.createdAt
                ? new Date(course.createdAt).toLocaleDateString()
                : "N/A"}
            </Text>
          </div>
          <p>Students enrolled: {course?.enrolledStudents?.length || 0}</p>
        </div>
      </div>

      {/* Course Content and Details */}
      <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
        <div className="w-full lg:w-1/2 space-y-5">
          <Title level={3}>Description</Title>
          <div
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: course?.description || "" }}
          />
          <Card>
            <Card.Meta
              title="Course Content"
              description={`${course?.lectures?.length || 0} lectures`}
            />
            <div className="p-4">
              {course?.lectures?.length ? (
                course.lectures.map((lecture: Lecture, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm">
                    <span>
                      {lecture.isPreviewFree ? (
                        <PlayCircleOutlined style={{ fontSize: 14 }} />
                      ) : (
                        <LockOutlined style={{ fontSize: 14 }} />
                      )}
                    </span>
                    <Text>{lecture.lectureTitle}</Text>
                  </div>
                ))
              ) : (
                <Text>No lectures available for this course.</Text>
              )}
            </div>
          </Card>
        </div>

        {/* Course Video and Purchase Section */}
        <div className="w-full lg:w-1/3">
          <Card>
            <div className="p-4 flex flex-col">
              <div className="w-full aspect-video mb-4">
                <ReactPlayer
                  width="100%"
                  height="100%"
                  url={course?.lectures?.[0].videoUrl || ""}
                  controls={true}
                />
              </div>
              <Title level={4}>{course?.lectures?.[0].lectureTitle || "Lecture Title"}</Title>
              <Divider className="my-2" />
              <Text className="text-lg md:text-xl font-semibold">
                {course?.coursePrice
                  ? `$${course.coursePrice.toFixed(2)}`
                  : "Price not available"}
              </Text>
            </div>
            <div className="p-4">
              {purchased ? (
                <Button type="primary" onClick={handleContinueCourse} block>
                  Continue Course
                </Button>
              ) : (
                <BuyCourseButton courseId={courseId} />
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;

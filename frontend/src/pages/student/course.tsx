import React from "react";
import { Card, Avatar, Badge, Typography, Row, Col } from "antd";
import { Link } from "react-router-dom";
import { Course as CourseType } from "../../types/types";

const { Title, Text } = Typography;

interface CourseProps {
  course: Partial<CourseType>; // Explicitly typing the `course` prop
}

const Course: React.FC<CourseProps> = ({ course }) => {
  console.log(course, "course")
  return (
    <Link to={`/course-detail/${course._id}`}>
      <Card
        hoverable
        className="overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg transform hover:scale-105 transition-all duration-300"
        cover={
          <img
            alt="course"
            src={course.courseThumbnail || ""}
            className="w-full h-36 object-cover rounded-t-lg"
          />
        }
      >
        <Card.Meta
          title={
            <Title level={4} className="hover:underline truncate">
              {course?.courseTitle || "No Title"}
            </Title>
          }
          description={
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Avatar size={40} src={course.creator?.photoUrl} alt={course.creator?.photoUrl || "Unknown"}>
                  {course.creator?.name?.charAt(0) || "CN"}
                </Avatar>
                <Text className="font-medium text-sm">
                  {course.creator?.name || "Unknown Creator"}
                </Text>
              </div>
              <Badge
                color="blue"
                text={course.courseLevel || "Unknown Level"}
                style={{ padding: "5px 10px", fontSize: "12px" }}
              />
            </div>
          }
        />
        <div className="mt-3 text-lg font-bold">
          <Text>₹{course.coursePrice?.toLocaleString() || "Free"}</Text>
        </div>
      </Card>
    </Link>
  );
};

export default Course;
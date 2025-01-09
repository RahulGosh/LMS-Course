import { Badge, Card, Typography } from "antd";
import { Course } from "../../features/api/courseApi";
import React from "react";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

type SearchResultProps = {
  course: Course;
};

const SearchResult = ({ course }: SearchResultProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-300 py-4 gap-4">
      <Link
        to={`/course-detail/${course._id}`}
        className="flex flex-col md:flex-row gap-4 w-full md:w-auto"
      >
        <Card
          hoverable
          cover={
            <img
              src={course.courseThumbnail}
              alt="course-thumbnail"
              className="h-32 w-full md:w-56 object-cover rounded"
            />
          }
          className="w-full"
        >
          <div className="flex flex-col gap-2">
            <Title level={4} className="text-lg md:text-xl">
              {course.courseTitle}
            </Title>
            <Text className="text-sm text-gray-600">{course.subTitle}</Text>
            <Text className="text-sm text-gray-700">
              Instructor: <span className="font-bold">{course.creator?.name}</span>
            </Text>
            <Badge
              color="blue"
              className="w-fit mt-2 md:mt-0"
            >
              {course.courseLevel}
            </Badge>
          </div>
        </Card>
      </Link>
      <div className="mt-4 md:mt-0 md:text-right w-full md:w-auto">
        <Title level={5} className="font-bold text-lg md:text-xl">
          ₹{course.coursePrice}
        </Title>
      </div>
    </div>
  );
};

export default SearchResult;
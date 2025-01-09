import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input, Button, Typography, Space, List, Spin, message } from "antd";
import { useCreateLectureMutation, useGetCourseLectureQuery } from "../../../features/api/courseApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import Lecture from "./lecture";

const { Title, Paragraph, Text } = Typography;

const CreateLecture = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const params = useParams();
  const navigate = useNavigate();
  const courseId = params.courseId || "";

  const [createLecture, { data, isLoading, isSuccess, error }] = useCreateLectureMutation();
  const {
    data: lectureData,
    isLoading: lectureLoading,
    isError: lectureError,
  } = useGetCourseLectureQuery(courseId);

  const createLectureHandler = async () => {
    if (!lectureTitle) {
      message.error("Lecture title is required");
      return;
    }

    if (!courseId) {
      message.error("Course ID is missing");
      return;
    }

    await createLecture({ lectureTitle, courseId });
  };

  useEffect(() => {
    if (isSuccess) {
      message.success(data?.message || "Lecture created successfully");
    }

    if (error) {
      const errorData = (error as FetchBaseQueryError)?.data as { message?: string };
      message.error(errorData?.message || "Failed to create lecture");
    }
  }, [isSuccess, error, data]);

  return (
    <div style={{ flex: 1, padding: "20px" }}>
      <div style={{ marginBottom: "16px" }}>
        <Title level={4}>Let's add lectures, add some basic details for your new lecture</Title>
        <Paragraph>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Possimus, laborum!
        </Paragraph>
      </div>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <div>
          <label style={{ fontWeight: 500, display: "block", marginBottom: "8px" }}>Title</label>
          <Input
            placeholder="Your Title Name"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
          />
        </div>
        <Space>
          <Button onClick={() => navigate(`/admin/courses/${courseId}`)}>Back to course</Button>
          <Button type="primary" loading={isLoading} onClick={createLectureHandler}>
            Create Lecture
          </Button>
        </Space>
        <div style={{ marginTop: "20px" }}>
          {lectureLoading ? (
            <Spin tip="Loading lectures..." />
          ) : lectureError ? (
            <Text type="danger">Failed to load lectures.</Text>
          ) : !lectureData?.lectures || lectureData.lectures.length === 0 ? (
            <Text>No lectures available</Text>
          ) : (
            <List
              dataSource={lectureData.lectures}
              renderItem={(lecture, index) => (
                <Lecture key={lecture._id} lecture={lecture} courseId={courseId} index={index} />
              )}
            />
          )}
        </div>
      </Space>
    </div>
  );
};

export default CreateLecture;
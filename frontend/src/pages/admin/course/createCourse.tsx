import { useEffect, useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateCourseMutation } from "../../../features/api/courseApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  Button,
  Form,
  Input,
  Select,
  Typography,
  Spin,
  Space,
} from "antd";

const { Title, Paragraph } = Typography;
const { Option } = Select;

const AddCourse = () => {
  const [courseTitle, setCourseTitle] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  const [createCourse, { data, error, isSuccess, isLoading }] =
    useCreateCourseMutation();

  const navigate = useNavigate();

  const createCourseHandler = async (): Promise<void> => {
    await createCourse({ courseTitle, category });
  };

  // useEffect(() => {
  //   if (isSuccess) {
  //     toast.success((data as { message: string })?.message || "Course Created Successfully");
  //     navigate("/admin/courses");
  //   }

  //   if (error) {
  //     const errorData = (error as FetchBaseQueryError)?.data as {
  //       message?: string;
  //     };
  //     toast.error(errorData?.message || "Failed to create course");
  //   }
  // }, [isSuccess, error, data, navigate]);

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "16px" }}>
        <Title level={3}>
          Let's add a course! Provide basic details for your new course
        </Title>
        <Paragraph>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus,
          laborum!
        </Paragraph>
      </div>
      <Form layout="vertical" onFinish={createCourseHandler}>
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please enter the course title" }]}
        >
          <Input
            value={courseTitle}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setCourseTitle(e.target.value)
            }
            placeholder="Your Course Name"
          />
        </Form.Item>
        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select
            placeholder="Select a category"
            onChange={(value) => setCategory(value)}
            value={category}
          >
            <Option value="Next JS">Next JS</Option>
            <Option value="Data Science">Data Science</Option>
            <Option value="Frontend Development">Frontend Development</Option>
            <Option value="Fullstack Development">Fullstack Development</Option>
            <Option value="MERN Stack Development">MERN Stack Development</Option>
            <Option value="Javascript">Javascript</Option>
            <Option value="Python">Python</Option>
            <Option value="Docker">Docker</Option>
            <Option value="MongoDB">MongoDB</Option>
            <Option value="HTML">HTML</Option>
          </Select>
        </Form.Item>
        <Space size="middle">
          <Button onClick={() => navigate("/admin/courses")} type="default">
            Back
          </Button>
          <Button type="primary" htmlType="submit" disabled={isLoading}>
            {isLoading ? (
              <Spin size="small" />
            ) : (
              "Create Course"
            )}
          </Button>
        </Space>
      </Form>
    </div>
  );
};

export default AddCourse;

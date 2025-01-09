import React, { useState, useEffect } from "react";
import { Button, Input, Select, Form, Upload, Card, Typography, Spin } from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { useEditCourseMutation, useGetCourseByIdQuery, usePublishCourseMutation } from "../../../features/api/courseApi";
import { useNavigate, useParams } from "react-router-dom";
import RichTextEditor, { CourseInputState } from "../../../components/richTextEditor";
// import { toast } from "sonner";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const { Title, Text } = Typography;
const { Option } = Select;

const CourseTab = () => {
  const [input, setInput] = useState<CourseInputState>({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
  });

  const params = useParams();
  const courseId = params.courseId || "";
  const [editCourse, { data, isLoading, isSuccess, error }] = useEditCourseMutation();
  const { data: courseData, isLoading: courseIsLoading, isSuccess: courseIsSuccess } = useGetCourseByIdQuery(courseId, { skip: !courseId });
  const [publishCourse] = usePublishCourseMutation();

  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>("");
  const navigate = useNavigate();
  const course = courseData?.course;

  useEffect(() => {
    if (courseIsSuccess && courseData?.course) {
      const course = courseData.course;
      setInput({
        courseTitle: course.courseTitle,
        subTitle: course.subTitle || "",
        description: course.description || "",
        category: course.category,
        courseLevel: course.courseLevel || "",
        coursePrice: course.coursePrice?.toString() || "",
        courseThumbnail: course.courseThumbnail || "",
      });

      if (course.courseThumbnail) {
        setPreviewThumbnail(course.courseThumbnail);
      }
    }
  }, [courseIsSuccess, course]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const handleSelectChange = (value: string, field: keyof CourseInputState) => {
    setInput({ ...input, [field]: value });
  };

  const handleThumbnailUpload = (file: File) => {
    setInput({ ...input, courseThumbnail: file });
    const fileReader = new FileReader();
    fileReader.onloadend = () => setPreviewThumbnail(fileReader.result as string);
    fileReader.readAsDataURL(file);
    return false; // Prevent default upload behavior
  };

  // useEffect(() => {
  //   if (isSuccess) {
  //     toast.success(data?.message || "");
  //     navigate("/admin/courses");
  //   }

  //   if (error) {
  //     const errorData = (error as FetchBaseQueryError)?.data as { message?: string };
  //     toast.error(errorData?.message || "Failed to create course");
  //   }
  // }, [isSuccess, error, data, navigate]);

  const updateCourseHandler = async () => {
    if (!courseId) return;

    const formData = new FormData();
    Object.entries(input).forEach(([key, value]) => {
      formData.append(key, value as string | Blob);
    });

    await editCourse({ formData, courseId });
  };

  if (courseIsLoading) return <Spin size="large" />;

  const publishStatusHandler = async (publish: boolean) => {
    if (!courseId) return;

    try {
      const response = await publishCourse({
        courseId,
        query: publish,
      }).unwrap();
      // toast.success(response.message || "Course status updated!");
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  return (
    <Card title="Basic Course Information" bordered>
      <Text>Make changes to your courses here. Click save when you're done.</Text>
      <Form layout="vertical" className="mt-5">
        <Form.Item label="Title">
          <Input
            name="courseTitle"
            value={input.courseTitle}
            onChange={handleInputChange}
            placeholder="Ex. Fullstack developer"
          />
        </Form.Item>
        <Form.Item label="Subtitle">
          <Input
            name="subTitle"
            value={input.subTitle}
            onChange={handleInputChange}
            placeholder="Ex. Become a Fullstack developer from zero to hero in 2 months"
          />
        </Form.Item>
        <Form.Item label="Description">
          {/* <RichTextEditor input={input} setInput={setInput} /> */}
        </Form.Item>
        <Form.Item label="Category">
          <Select
            value={input.category}
            onChange={(value) => handleSelectChange(value, "category")}
            placeholder="Select a category"
          >
            {[
              "Next JS",
              "Data Science",
              "Frontend Development",
              "Fullstack Development",
              "MERN Stack Development",
              "Javascript",
              "Python",
              "Docker",
              "MongoDB",
              "HTML",
            ].map((category) => (
              <Option key={category} value={category}>
                {category}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Course Level">
          <Select
            value={input.courseLevel}
            onChange={(value) => handleSelectChange(value, "courseLevel")}
            placeholder="Select a course level"
          >
            {["Beginner", "Medium", "Advance"].map((level) => (
              <Option key={level} value={level}>
                {level}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Price in (INR)">
          <Input
            type="number"
            name="coursePrice"
            value={input.coursePrice}
            onChange={handleInputChange}
            placeholder="199"
          />
        </Form.Item>
        <Form.Item label="Course Thumbnail">
          <Upload
            listType="picture-card"
            beforeUpload={handleThumbnailUpload}
            showUploadList={false}
          >
            {previewThumbnail ? (
              <img src={previewThumbnail} alt="Thumbnail" style={{ width: "100%" }} />
            ) : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button onClick={() => navigate("/admin/courses")} style={{ marginRight: "10px" }}>
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={updateCourseHandler}
            loading={isLoading}
          >
            Save
          </Button>
          <Button
            danger
            onClick={() => publishStatusHandler(!course?.isPublished)}
            style={{ marginLeft: "10px" }}
          >
            {course?.isPublished ? "Unpublish" : "Publish"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CourseTab;

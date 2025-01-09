import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  Form,
  Input,
  Switch,
  Upload,
  Typography,
  Space,
  message as antMessage,
} from "antd";
import {
  useEditLectureMutation,
  useGetLectureByIdQuery,
  useRemoveLectureMutation,
} from "../../../features/api/courseApi";
import { UploadOutlined, LoadingOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const LectureTab: React.FC = () => {
  const [form] = Form.useForm();
  const [input, setInput] = useState<{
    lectureTitle: string;
    isPreviewFree: boolean;
    videoFile: File | null;
  }>({
    lectureTitle: "",
    isPreviewFree: false,
    videoFile: null,
  });

  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const params = useParams();
  const courseId = params.courseId || "";
  const lectureId = params.lectureId || "";

  const [editLecture, { isLoading: isMutationLoading, isSuccess, error }] =
    useEditLectureMutation();
  const [
    removeLecture,
    { data: removeData, isLoading: removeLoading, isSuccess: removeSuccess },
  ] = useRemoveLectureMutation();
  const {
    data: lectureData,
    isLoading: lectureIsLoading,
    isSuccess: lectureIsSuccess,
  } = useGetLectureByIdQuery({ lectureId }, { skip: !lectureId });

  const navigate = useNavigate();

  useEffect(() => {
    if (lectureIsSuccess && lectureData?.lecture) {
      const lecture = lectureData.lecture;
      setInput({
        lectureTitle: lecture.lectureTitle || "",
        isPreviewFree: lecture.isPreviewFree || false,
        videoFile: null,
      });

      form.setFieldsValue({
        lectureTitle: lecture.lectureTitle || "",
        isPreviewFree: lecture.isPreviewFree || false,
      });

      if (lecture.videoUrl) {
        setPreviewVideo(lecture.videoUrl);
      }
    }
  }, [lectureIsSuccess, lectureData, form]);

  const selectVideoFile = (file: File) => {
    setInput({ ...input, videoFile: file });
    const videoURL = URL.createObjectURL(file);
    setPreviewVideo(videoURL);
    return false; // Prevent default upload behavior
  };

  const updateLectureHandler = async () => {
    if (!lectureId || !courseId) return;

    const formData = new FormData();
    formData.append("lectureTitle", input.lectureTitle);
    formData.append("isPreviewFree", input.isPreviewFree.toString());
    if (input.videoFile) formData.append("videoFile", input.videoFile);

    setIsUploading(true);

    await editLecture({
      formData,
      courseId,
      lectureId,
    });

    setIsUploading(false);
  };

  const removeLectureHandler = async () => {
    await removeLecture({ lectureId });
  };

  useEffect(() => {
    if (removeSuccess) {
      antMessage.success(removeData?.message);
      navigate(`/admin/courses/${courseId}`);
    }
  }, [removeSuccess, removeData, navigate, courseId]);

  useEffect(() => {
    if (isSuccess || error) {
      antMessage[isSuccess ? "success" : "error"](
        isSuccess
          ? "Lecture updated successfully"
          : "Failed to update lecture"
      );
      if (isSuccess) navigate(`/admin/courses/${courseId}`);
    }
  }, [isSuccess, error, navigate, courseId]);

  if (lectureIsLoading) return <Title>Loading...</Title>;

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <Title level={4}>Edit Lecture</Title>
            <Text type="secondary">Make changes and click save when done.</Text>
          </div>
          <Button
            type="primary"
            danger
            loading={removeLoading}
            onClick={removeLectureHandler}
          >
            {removeLoading ? <LoadingOutlined /> : "Remove Lecture"}
          </Button>
        </div>

        <Form
          form={form}
          layout="vertical"
          onValuesChange={(changedValues) => {
            setInput({ ...input, ...changedValues });
          }}
        >
          <Form.Item
            label="Title"
            name="lectureTitle"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input placeholder="Ex. Introduction to Javascript" />
          </Form.Item>

          <Form.Item label="Video" required>
            <Upload
              beforeUpload={selectVideoFile}
              accept="video/*"
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Select Video File</Button>
            </Upload>
            {previewVideo && (
              <video
                src={previewVideo}
                controls
                style={{ width: "100%", maxWidth: "400px", marginTop: "10px" }}
              />
            )}
          </Form.Item>

          <Form.Item name="isPreviewFree" valuePropName="checked">
            <Space>
              <Switch />
              <Text>Is this video FREE</Text>
            </Space>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              loading={isMutationLoading || isUploading}
              onClick={updateLectureHandler}
            >
              {isMutationLoading || isUploading ? (
                <>
                  <LoadingOutlined /> Please wait
                </>
              ) : (
                "Update Lecture"
              )}
            </Button>
          </Form.Item>
        </Form>
      </Space>
    </Card>
  );
};

export default LectureTab;

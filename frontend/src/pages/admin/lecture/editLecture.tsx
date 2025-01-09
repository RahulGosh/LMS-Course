import React from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Typography, Space } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import LectureTab from "./lectureTab";

const { Title } = Typography;

const EditLecture = () => {
  const { courseId, lectureId } = useParams();

  console.log("courseId:", courseId, "lectureId:", lectureId);

  return (
    <div style={{ padding: "20px" }}>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Link to={`/admin/course/${courseId}/lecture`}>
              <Button shape="circle" icon={<ArrowLeftOutlined />} />
            </Link>
            <Title level={4} style={{ margin: 0 }}>
              Update Your Lecture
            </Title>
          </div>
        </div>
        <LectureTab />
      </Space>
    </div>
  );
};

export default EditLecture;
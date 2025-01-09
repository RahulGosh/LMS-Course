import React from "react";
import { Button, Typography } from "antd";
import { Link } from "react-router-dom";
import CourseTab from "./courseTab";

const { Title } = Typography;

const EditCourse = () => {
  return (
    <div style={{ flex: 1, padding: "20px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <Title level={4}>Add detailed information regarding the course</Title>
        <Link to="lecture">
          <Button type="link" style={{ color: "#1677ff" }}>
            Go to lectures page
          </Button>
        </Link>
      </div>
      <CourseTab />
    </div>
  );
};

export default EditCourse;

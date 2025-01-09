import React, { useEffect } from "react";
import { MenuOutlined, UserOutlined, LogoutOutlined, ProfileOutlined } from "@ant-design/icons";
import { Button, Dropdown, Avatar, Menu, Layout, Space, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../features/api/authApi";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { User } from "../types/types"; // Import the `User` type

const { Header } = Layout;

const Navbar: React.FC = () => {
  const { user } = useSelector((store: RootState) => store.auth) as { user: User | null };
  const [logoutUser, { data, isSuccess }] = useLogoutMutation();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess) {
      message.success(data?.message || "User logged out.");
      navigate("/login");
    }
  }, [isSuccess, data, navigate]);

  const menuItems = [
    {
      key: "1",
      label: <Link to="/my-learning">My Learning</Link>,
      icon: <ProfileOutlined />,
    },
    {
      key: "2",
      label: <Link to="/profile">Edit Profile</Link>,
      icon: <UserOutlined />,
    },
    ...(user?.role === "instructor"
      ? [
          {
            key: "3",
            label: <Link to="/admin/dashboard">Dashboard</Link>,
            icon: <MenuOutlined />,
          },
        ]
      : []),
    {
      key: "4",
      label: (
        <span onClick={logoutHandler} style={{ cursor: "pointer" }}>
          Log out
        </span>
      ),
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <Header
      className="site-layout-background"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: "#fff",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <MenuOutlined style={{ fontSize: "24px" }} />
          <Link to="/">
            <h1 style={{ fontWeight: "bold", fontSize: "24px" }}>E-Learning</h1>
          </Link>
        </div>

        {/* User actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          {user ? (
            <Dropdown overlay={<Menu items={menuItems} />} placement="bottomRight">
              <Avatar
                size="large"
                src={user.photoUrl || "https://github.com/shadcn.png"}
                style={{ cursor: "pointer" }}
              >
                {user.name ? user.name.charAt(0) : "U"}
              </Avatar>
            </Dropdown>
          ) : (
            <Space>
              <Button type="link" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button type="primary" onClick={() => navigate("/signup")}>
                Signup
              </Button>
            </Space>
          )}
        </div>
      </div>
    </Header>
  );
};

export default Navbar;
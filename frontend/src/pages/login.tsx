import React, { useEffect, useState } from "react";
import { Tabs, Input, Button, Card, Typography, Form, Spin, message } from "antd";
import { Loader2 } from "lucide-react"; // Optional, if you still want to keep the lucide icon
import { Login, Register } from "../types/types";
import { useLoginMutation, useRegisterMutation } from "../features/api/authApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const LoginComponent = () => {
  const [signupInput, setSignupInput] = useState<Register>({
    name: "",
    email: "",
    password: "",
  });

  const [loginInput, setLoginInput] = useState<Login>({
    email: "",
    password: "",
  });

  const [
    registerUser,
    {
      data: registerData,
      error: registerError,
      isLoading: registerIsLoading,
      isSuccess: registerIsSuccess,
    },
  ] = useRegisterMutation();

  const [
    loginUser,
    {
      data: loginData,
      error: loginError,
      isLoading: loginIsLoading,
      isSuccess: loginIsSuccess,
    },
  ] = useLoginMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (registerIsSuccess && registerData) {
      message.success(registerData.message || "Registered Successfully");
      navigate("/");
    }

    if (registerError) {
      const errorData = (registerError as FetchBaseQueryError)?.data as { message?: string };
      message.error(errorData?.message || "Registration Failed");
    }

    if (loginError) {
      const errorData = (loginError as FetchBaseQueryError)?.data as { message?: string };
      message.error(errorData?.message || "Login Failed");
    }

    if (loginIsSuccess && loginData) {
      message.success(loginData.message || "Logged In Successfully");
      navigate("/");
    }
  }, [
    registerIsLoading,
    loginIsLoading,
    registerData,
    loginData,
    loginError,
    registerError,
  ]);

  const changeInputHandler = (e: React.ChangeEvent<HTMLInputElement>, type: "signup" | "login") => {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignupInput((prev) => ({ ...prev, [name]: value }));
    } else {
      setLoginInput((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRegistration = async (type: "signup" | "login") => {
    if (type === "signup") {
      const inputData = signupInput;
      try {
        await registerUser(inputData).unwrap();
      } catch (error) {
        console.error("Signup Error:", error);
      }
    } else if (type === "login") {
      const inputData = loginInput;
      try {
        await loginUser(inputData).unwrap();
      } catch (error) {
        console.error("Login Error:", error);
      }
    }
  };

  return (
    <div className="flex items-center w-full justify-center mt-20">
      <Tabs defaultActiveKey="login" className="w-[400px]" type="card">
        {/* Signup Tab */}
        <Tabs.TabPane tab="Signup" key="signup">
          <Card>
            <Title level={4}>Signup</Title>
            <Text>Create a new account and click signup when you're done.</Text>
            <Form className="space-y-4" layout="vertical">
              <Form.Item label="Name" name="name" required>
                <Input
                  type="text"
                  name="name"
                  placeholder="Eg. patel"
                  value={signupInput.name}
                  onChange={(e) => changeInputHandler(e, "signup")}
                />
              </Form.Item>
              <Form.Item label="Email" name="email" required>
                <Input
                  type="email"
                  name="email"
                  placeholder="Eg. patel@gmail.com"
                  value={signupInput.email}
                  onChange={(e) => changeInputHandler(e, "signup")}
                />
              </Form.Item>
              <Form.Item label="Password" name="password" required>
                <Input
                  type="password"
                  name="password"
                  placeholder="Eg. xyz"
                  value={signupInput.password}
                  onChange={(e) => changeInputHandler(e, "signup")}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  block
                  type="primary"
                  disabled={registerIsLoading}
                  onClick={() => handleRegistration("signup")}
                >
                  {registerIsLoading ? (
                    <Spin spinning={registerIsLoading} /> 
                  ) : (
                    "Signup"
                  )}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Tabs.TabPane>

        {/* Login Tab */}
        <Tabs.TabPane tab="Login" key="login">
          <Card>
            <Title level={4}>Login</Title>
            <Text>Login with your credentials here.</Text>
            <Form className="space-y-4" layout="vertical">
              <Form.Item label="Email" name="email" required>
                <Input
                  type="email"
                  name="email"
                  placeholder="Eg. patel@gmail.com"
                  value={loginInput.email}
                  onChange={(e) => changeInputHandler(e, "login")}
                />
              </Form.Item>
              <Form.Item label="Password" name="password" required>
                <Input
                  type="password"
                  name="password"
                  placeholder="Eg. xyz"
                  value={loginInput.password}
                  onChange={(e) => changeInputHandler(e, "login")}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  block
                  type="primary"
                  disabled={loginIsLoading}
                  onClick={() => handleRegistration("login")}
                >
                  {loginIsLoading ? (
                    <Spin spinning={loginIsLoading} />
                  ) : (
                    "Login"
                  )}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default LoginComponent;
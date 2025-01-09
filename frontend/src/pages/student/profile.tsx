import { Avatar, Button, Input, Modal, Form, Upload, message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoadUserQuery, useUpdateUserMutation } from "../../features/api/authApi";
import { Loader2 } from "lucide-react";
import Course from "./course";

const Profile = () => {
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | string>("");

  const { data, isLoading, refetch } = useLoadUserQuery();
  const [
    updateUser,
    {
      data: updateUserData,
      isLoading: updateUserIsLoading,
      isError,
      error,
      isSuccess,
    },
  ] = useUpdateUserMutation();

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file); // No type error now
  };

  const updateUserHandler = async () => {
    const formData = new FormData();
    formData.append("name", name);
    if (profilePhoto instanceof File) {
      formData.append("profilePhoto", profilePhoto);
    }

    try {
      await updateUser(formData).unwrap();
      refetch(); // Refetch user data to get the latest state
    } catch (err) {
      console.error("Update Profile Error:", err);
      // toast.error("Failed to update profile.");
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  // useEffect(() => {
  //   if (isSuccess) {
  //     refetch();
  //     toast.success(data?.message || "Profile updated.");
  //   }
  //   if (isError) {
  //     toast.error(data?.message || "Failed to update profile");
  //   }
  // }, [error, updateUserData, isSuccess, isError]);

  if (isLoading) return <h1>Profile Loading...</h1>;

  const user = data && data;

  return (
    <div className="max-w-4xl mx-auto px-4 my-10">
      <h1 className="font-bold text-2xl text-center md:text-left">PROFILE</h1>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
        <div className="flex flex-col items-center">
          <Avatar size={64} src={user?.photoUrl || "https://github.com/shadcn.png"} />
        </div>
        <div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
              Name:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user?.name}
              </span>
            </h1>
          </div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
              Email:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user?.email}
              </span>
            </h1>
          </div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
              Role:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user?.role.toUpperCase()}
              </span>
            </h1>
          </div>
          <Button type="primary" onClick={() => setName(user?.name || "")}>
            Edit Profile
          </Button>
        </div>
      </div>

      <Modal
        title="Edit Profile"
        visible={Boolean(name)}
        onCancel={() => setName("")}
        footer={null}
      >
        <Form layout="vertical" onFinish={updateUserHandler}>
          <Form.Item label="Name">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </Form.Item>

          <Form.Item label="Profile Photo">
            <Upload
              beforeUpload={(file) => {
                setProfilePhoto(file);
                return false; // Prevent automatic upload
              }}
              showUploadList={false}
            >
              <Button>Click to Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={updateUserIsLoading}
              disabled={updateUserIsLoading}
            >
              {updateUserIsLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <div>
        <h1 className="font-medium text-lg">Courses you're enrolled in</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
          {user?.enrolledCourses.length === 0 ? (
            <h1>You haven't enrolled yet</h1>
          ) : (
            user?.enrolledCourses.map((course) => (
              <Course course={course} key={course._id} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

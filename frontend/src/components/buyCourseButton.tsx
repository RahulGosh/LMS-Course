import React, { useEffect } from "react";
import { Button, Spin } from "antd";
import { useCreateCheckoutSessionMutation } from "../features/api/purchaseApi";

const BuyCourseButton = ({ courseId }: { courseId: string }) => {
  const [
    createCheckoutSession,
    { data, isLoading, isSuccess, isError, error },
  ] = useCreateCheckoutSessionMutation();

  const purchaseCourseHandler = async () => {
    try {
      await createCheckoutSession(courseId);
    } catch (err) {
      console.error("Error creating checkout session:", err);
    }
  };

  useEffect(() => {
    console.log("API Response Data:", data);
  }, [data]);

  useEffect(() => {
    if (isSuccess) {
      if (data?.url) {
        window.location.href = data.url; // Redirect to Stripe checkout URL
      } else {
        console.log("Invalid response from server.")
      }
    }
    if (isError) {
      console.log("Failed to create checkout session")
    }
  }, [data, isSuccess, isError, error]);

  return (
    <Button
      type="primary"
      block
      disabled={isLoading}
      onClick={purchaseCourseHandler}
      style={{ height: "40px" }}
    >
      {isLoading ? (
        <>
          <Spin size="small" style={{ marginRight: "8px" }} />
          Please wait
        </>
      ) : (
        "Purchase Course"
      )}
    </Button>
  );
};

export default BuyCourseButton;

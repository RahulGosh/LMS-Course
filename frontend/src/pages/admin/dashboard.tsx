import React from "react";
import { Card, Row, Col, Typography } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useGetAllPurchasedCoursesQuery } from "../../features/api/purchaseApi";

const { Title } = Typography;

const Dashboard = () => {
  const { data, isError, isLoading } = useGetAllPurchasedCoursesQuery();

  if (isLoading) return <p>Loading...</p>;
  if (isError || !data) return <p>Error fetching data or no data available!</p>;

  // Map course data for the chart
  const courseData = data?.purchasedCourse.map((purchase) => ({
    name: purchase.courseId?.courseTitle || "Unknown Course",
    price: purchase.courseId?.coursePrice || 0,
  }));

  // Calculate total revenue and total sales
  const totalRevenue = data?.purchasedCourse.reduce((acc, purchase) => acc + (purchase.amount || 0), 0);
  const totalSales = data?.purchasedCourse.length;

  return (
    <div>
      <Row gutter={[16, 16]} className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {/* Total Sales Card */}
        <Col span={12} sm={8} md={6} lg={4}>
          <Card
            title={<Title level={4}>Total Sales</Title>}
            bordered={false}
            className="shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <p className="text-3xl font-bold text-blue-600">{totalSales}</p>
          </Card>
        </Col>

        {/* Total Revenue Card */}
        <Col span={12} sm={8} md={6} lg={4}>
          <Card
            title={<Title level={4}>Total Revenue</Title>}
            bordered={false}
            className="shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <p className="text-3xl font-bold text-blue-600">{totalRevenue}</p>
          </Card>
        </Col>

        {/* Course Prices Card */}
        <Col span={24}>
          <Card
            title={<Title level={4}>Course Prices</Title>}
            bordered={false}
            className="shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={courseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="name"
                  stroke="#6b7280"
                  angle={-30} // Rotated labels for better visibility
                  textAnchor="end"
                  interval={0} // Display all labels
                />
                <YAxis stroke="#6b7280" />
                <Tooltip formatter={(value, name) => [`₹${value}`, name]} />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#4a90e2" // Changed color to a different shade of blue
                  strokeWidth={3}
                  dot={{ stroke: "#4a90e2", strokeWidth: 2 }} // Same color for the dot
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;

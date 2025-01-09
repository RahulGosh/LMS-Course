import React, { useState, useEffect } from "react";
import { Skeleton, Alert, Button, Divider } from "antd";
import { Link, useSearchParams } from "react-router-dom";
import { AlertOutlined } from "@ant-design/icons";
import SearchResult from "./searchResult";
import Filter from "./filter";
import { useSearchCourseQuery } from "../../features/api/courseApi";

type FilterChangeHandler = (categories: string[], price: string) => void;

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("createdAt");

  // Fetch courses based on query, sort, and categories
  const { data, isLoading, isError } = useSearchCourseQuery({
    query,
    sortBy,
    categories: selectedCategories.join(","),
  });

  const isEmpty = !isLoading && data?.courses.length === 0;

  const handleFilterChange: FilterChangeHandler = (categories, price) => {
    setSelectedCategories(categories);
    // You can handle price filtering logic here, e.g., if price is set, update the sortBy or other logic
    setSortBy(price);  // Update the sort order
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="my-6">
        <h1 className="font-bold text-xl md:text-2xl">Result for "{query}"</h1>
        <p>
          Showing results for{" "}
          <span className="text-blue-800 font-bold italic">{query}</span>
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-10">
        <Filter handleFilterChange={handleFilterChange} />
        <div className="flex-1">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <CourseSkeleton key={idx} />
            ))
          ) : isEmpty ? (
            <CourseNotFound />
          ) : (
            data?.courses?.map((course) => (
              <SearchResult key={course._id} course={course} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

const CourseNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-32 dark:bg-gray-900 p-6">
      <Alert
        type="error"
        icon={<AlertOutlined className="text-red-500" />}
        message="Course Not Found"
        description="Sorry, we couldn't find the course you're looking for."
        showIcon
        className="w-full mb-4"
      />
      <Link to="/" className="italic">
        <Button type="link">Browse All Courses</Button>
      </Link>
    </div>
  );
};

const CourseSkeleton = () => {
  return (
    <div className="flex-1 flex flex-col md:flex-row justify-between border-b border-gray-300 py-4">
      <div className="h-32 w-full md:w-64">
        <Skeleton.Image className="h-full w-full object-cover" />
      </div>

      <div className="flex flex-col gap-2 flex-1 px-4">
        <Skeleton.Input active size="small" className="w-3/4" />
        <Skeleton.Input active size="small" className="w-1/2" />
        <div className="flex items-center gap-2">
          <Skeleton.Input active size="small" className="w-1/3" />
        </div>
        <Skeleton.Button active size="small" className="w-20 mt-2" />
      </div>

      <div className="flex flex-col items-end justify-between mt-4 md:mt-0">
        <Skeleton.Button active size="small" className="w-12" />
      </div>
    </div>
  );
};

import { Checkbox, Divider, Select } from "antd";
import React, { useState } from "react";

// Define a type for categories
type Category = {
  id: string;
  label: string;
};

// Props type for the Filter component
type FilterProps = {
  handleFilterChange: (
    selectedCategories: string[],
    sortByPrice: string
  ) => void;
};

// Define categories as a constant
const categories: Category[] = [
  { id: "nextjs", label: "Next JS" },
  { id: "data science", label: "Data Science" },
  { id: "frontend development", label: "Frontend Development" },
  { id: "Fullstack Development", label: "Fullstack Development" },
  { id: "mern stack development", label: "MERN Stack Development" },
  { id: "backend development", label: "Backend Development" },
  { id: "javascript", label: "Javascript" },
  { id: "python", label: "Python" },
  { id: "docker", label: "Docker" },
  { id: "mongodb", label: "MongoDB" },
  { id: "HTML", label: "HTML" },
];

const Filter: React.FC<FilterProps> = ({ handleFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortByPrice, setSortByPrice] = useState<string>("");

  const handleCategoryChange = (checkedValues: string[]) => {
    setSelectedCategories(checkedValues); // Directly update with the array of checked values
    handleFilterChange(checkedValues, sortByPrice);
  };

  const selectByPriceHandler = (selectedValue: string) => {
    setSortByPrice(selectedValue); // Update the price sorting state
    handleFilterChange(selectedCategories, selectedValue); // Trigger the parent handler
  };

  return (
    <div className="w-full md:w-[20%]">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-lg md:text-xl">Filter Options</h1>
        <Select
          value={sortByPrice}
          onChange={selectByPriceHandler}
          style={{ width: "200px" }}
          placeholder="Sort by"
        >
          <Select.Option value="price">Price: Low to High</Select.Option>
          <Select.Option value="-price">Price: High to Low</Select.Option>
          <Select.Option value="rating">Rating</Select.Option> {/* New option */}
          <Select.Option value="popularity">Popularity</Select.Option> {/* New option */}
          <Select.Option value="-createdAt">Newest</Select.Option> {/* New option */}
          <Select.Option value="title">A-Z</Select.Option> {/* New option */}
          <Select.Option value="-title">Z-A</Select.Option> {/* New option */}
        </Select>
      </div>
      <Divider className="my-4" />
      <div>
        <h1 className="font-semibold mb-2">CATEGORY</h1>
        <Checkbox.Group
          value={selectedCategories}
          onChange={handleCategoryChange}
          style={{ display: "flex", flexDirection: "column" }}
        >
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2 my-2">
              <Checkbox value={category.id} />
              <span className="text-sm font-medium">{category.label}</span>
            </div>
          ))}
        </Checkbox.Group>
      </div>
    </div>
  );
};

export default Filter;

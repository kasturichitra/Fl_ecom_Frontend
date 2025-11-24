import React from "react";
import Select from "react-select";

const CategorySelector = ({ categories, selected, setSelected }) => {
  const options = categories.map((cat) => ({
    value: cat._id,   // MUST be a Mongo object id
    label: cat.category_name,        // MUST be a string
  }));

  return (
    <div className="w-full mb-4">
      <label className="block text-gray-700 font-semibold mb-1">
        Select Categories (Multiple)
      </label>

      <Select
        isMulti
        options={options}
        value={options.filter((opt) => selected.includes(opt.value))}
        onChange={(selectedOptions) =>
          setSelected(selectedOptions.map((opt) => opt.value))
        }
        className="basic-multi-select"
        classNamePrefix="select"
        required = {false}
      />
    </div>
  );
};

export default CategorySelector;
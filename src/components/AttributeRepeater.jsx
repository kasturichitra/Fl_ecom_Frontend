import { useEffect, useState } from "react";

const AttributeRepeater = ({
  label = "Attributes",
  predefined = [],   // DB attributes → [{ attribute_code, value, disabled: true, placeholder, type }]
  onChange,
}) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Load predefined DB attributes (non-removable)
    const dbItems = predefined.map((item) => ({
      ...item,
      isPredefined: true,  // flag to prevent delete
    }));

    setItems([...dbItems]);
    if (onChange) onChange([...dbItems]);
  }, [predefined]);

  const updateItems = (newItems) => {
    setItems(newItems);
    if (onChange) onChange(newItems);
  };

  const handleFieldChange = (index, key, value) => {
    const updated = [...items];
    updated[index][key] = value;
    updateItems(updated);
  };

  const addItem = () => {
    updateItems([
      ...items,
      {
        attribute_code: "",
        value: "",
        placeholder: "Enter value",
        type: "text",
        isPredefined: false, // User-generated
      },
    ]);
  };

  const deleteItem = (index) => {
    const item = items[index];

    if (item.isPredefined) return; // Cannot delete DB provided items

    updateItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 mt-8 shadow-sm">

      <h3 className="text-2xl font-semibold text-gray-800 mb-6">{label}</h3>

      <div className="space-y-6">
        {items.map((item, index) => (
          <div key={index} className="border border-gray-300 rounded-xl p-6 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Attribute Code */}
              <input
                type="text"
                placeholder={item.placeholderCode || "Attribute Code"}
                value={item.attribute_code}
                disabled={item.isPredefined}  // DB items → code locked
                onChange={(e) => handleFieldChange(index, "attribute_code", e.target.value)}
                className={`px-4 py-3 border rounded-lg outline-none transition 
                 ${item.isPredefined ? "bg-gray-200 cursor-not-allowed" : "border-gray-300 focus:ring-2 focus:ring-blue-500"}`}
              />

              {/* Value */}
              <input
                type={item.type || "text"}
                placeholder={item.placeholderValue || "Value"}
                value={item.value}
                onChange={(e) => handleFieldChange(index, "value", e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              />

            </div>

            {/* Delete button only for user-added */}
            {!item.isPredefined && (
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => deleteItem(index)}
                  className="text-red-600 hover:text-red-700 font-medium underline"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="mt-6 px-5 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
      >
        + Add Attribute
      </button>
    </div>
  );
};

export default AttributeRepeater;

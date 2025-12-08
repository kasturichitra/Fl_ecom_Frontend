export const PRODUCT_STATIC_FIELDS = [
  {
    key: "product_unique_id",
    label: "Product Unique ID *",
    type: "text",

    placeholder: "e.g., HF1-002",
    isEditOnly: true,
  },
  {
    key: "product_name",
    label: "Product Name *",
    type: "text",
    
    placeholder: "e.g., Premium Cotton Bedsheet",
  },
  {
    key: "product_color",
    label: "Product Color",
    type: "text",
    placeholder: "e.g., White",
  },
  {
    key: "product_size",
    label: "Product Size",
    type: "text",
    placeholder: "e.g., 3x4",
  },
  {
    key: "base_price",
    label: "base_price*",
    type: "number",
    
    min: 0,
  },
  {
    key: "discount_percentage",
    label: "Discount Percentage",
    type: "number",
    min: 0,
    max: 99,
  },
  {
    key: "cgst",
    label: "CGST %",
    type: "number",
    min: 0,
  },
  {
    key: "sgst",
    label: "SGST %",
    type: "number",
    min: 0,
  },
  {
    key: "igst",
    label: "IGST %",
    type: "number",
    min: 0,
  },
  {
    key: "stock_quantity",
    label: "Stock Quantity *",
    type: "number",
    
    min: 0,
  },
  {
    key: "min_order_limit",
    label: "Minimum Order Limit *",
    type: "number",
    
    min: 1,
  },
  {
    key: "gender",
    label: "Gender *",
    type: "select",
    
    options: [
      { label: "Unisex", value: "Unisex" },
      { label: "Men", value: "Men" },
      { label: "Women", value: "Women" },
    ],
  },
    {
    key: "product_description",
    label: "Product Description",
    type: "textarea",
    placeholder: "e.g., Premium Cotton Bedsheet",
  },
  {
    key: "product_image",
    label: "Product Image *",
    type: "file",
    
    accept: "image/*",
  },
];

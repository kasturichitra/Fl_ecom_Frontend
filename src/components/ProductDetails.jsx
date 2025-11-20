// import React, { useState, useEffect } from "react";

// const ProductDetails = ({ productId, onBack }) => {
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (productId) {
//       fetchProductDetails(productId);
//     }
//   }, [productId]);

//   const fetchProductDetails = async (productId) => {
//     try {
//       setLoading(true);
//       setError(null);

//       // const token = localStorage.getItem('token');
//       const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MTFjNWE3N2JiN2IxZjFkMTVjZjNlNSIsImlhdCI6MTc2Mjc3MzU4NiwiZXhwIjoxNzY1MzY1NTg2fQ.n4rHCBh0T6e8jv1eUvMXr6OWkIFts1VaJzmvxRjTRW8.KdzRNr-xIK006dHchbHZvoP9h9fWAMTiQJ1n5k7ZnMA`
//       if (!token) {
//         setError('No authentication token found. Please log in.');
//         setLoading(false);
//         return;
//       }

//       const response = await fetch(`http://10.1.1.156:3000/api/getProductById/${productId}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.ok) {
//         const productData = await response.json();
//         setProduct(productData);
//       } else {
//         const errorText = await response.text();
//         setError(`Failed to fetch product: ${errorText}`);
//       }
//     } catch (err) {
//       setError(`Error fetching product: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <div className="text-center text-gray-500 mt-10">Loading product details...</div>;
//   }

//   if (error) {
//     return (
//       <div className="text-center text-red-500 mt-10">
//         <p>{error}</p>
//         <button
//           onClick={onBack}
//           className="mt-4 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
//         >
//           ← Back to List
//         </button>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="text-center text-gray-500 mt-10">
//         <p>No product found.</p>
//         <button
//           onClick={onBack}
//           className="mt-4 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
//         >
//           ← Back to List
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 mt-10">
//       <button
//         onClick={onBack}
//         className="mb-4 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
//       >
//         ← Back to List
//       </button>
//       <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
//         {product.product_name}
//       </h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* IDs */}
//         <div>
//           <h3 className="text-xl font-semibold mb-4">IDs</h3>
//           <p><strong>Sub Category Unique ID:</strong> {product.subCategory_unique_ID}</p>
//           <p><strong>Products Unique ID:</strong> {product.products_unique_ID}</p>
//         </div>

//         {/* Basic Info */}
//         <div>
//           <h3 className="text-xl font-semibold mb-4">Basic Info</h3>
//           <p><strong>Brand:</strong> {product.product_brand_name}</p>
//           <p><strong>Description:</strong> {product.product_description}</p>
//           <p><strong>Color:</strong> {product.product_color}</p>
//           <p><strong>Size:</strong> {product.product_size}</p>
//         </div>

//         {/* Product Details */}
//         <div>
//           <h3 className="text-xl font-semibold mb-4">Product Details</h3>
//           <p><strong>Model Number:</strong> {product.model_number}</p>
//           <p><strong>SKU:</strong> {product.sku}</p>
//           <p><strong>Product Code:</strong> {product.product_code}</p>
//           <p><strong>Barcode:</strong> {product.barcode}</p>
//         </div>

//         {/* Pricing */}
//         <div>
//           <h3 className="text-xl font-semibold mb-4">Pricing</h3>
//           <p><strong>Price:</strong> {product.currency} {product.price}</p>
//           <p><strong>Discount:</strong> {product.discount_percentage}%</p>
//           <p><strong>Discount Price:</strong> {product.currency} {product.discount_price}</p>
//           <p><strong>GST:</strong> {product.product_GST}%</p>
//           <p><strong>GST Number:</strong> {product.GST_number}</p>
//         </div>

//         {/* Stock */}
//         <div>
//           <h3 className="text-xl font-semibold mb-4">Stock</h3>
//           <p><strong>Availability:</strong> {product.stock_availability ? "Yes" : "No"}</p>
//           <p><strong>Quantity:</strong> {product.stock_quantity}</p>
//           <p><strong>Min Order:</strong> {product.min_order_limit}</p>
//           <p><strong>Max Order:</strong> {product.max_order_limit}</p>
//         </div>

//         {/* Demographics */}
//         <div>
//           <h3 className="text-xl font-semibold mb-4">Demographics</h3>
//           <p><strong>Gender:</strong> {product.gender}</p>
//           <p><strong>Age:</strong> {product.age}+</p>
//           <p><strong>Country of Origin:</strong> {product.country_of_origin}</p>
//         </div>

//         {/* Tags and Warranty */}
//         <div>
//           <h3 className="text-xl font-semibold mb-4">Tags & Warranty</h3>
//           <p><strong>Tags:</strong> {product.tag}</p>
//           <p><strong>Warranty:</strong> {product.product_warranty}</p>
//           <p><strong>Warranty Type:</strong> {product.warranty_type}</p>
//         </div>

//         {/* Policies */}
//         <div>
//           <h3 className="text-xl font-semibold mb-4">Policies</h3>
//           <p><strong>Return Policy:</strong> {product.return_policy}</p>
//           <p><strong>Replacement Available:</strong> {product.replacement_available ? "Yes" : "No"}</p>
//         </div>

//         {/* Shipping */}
//         <div>
//           <h3 className="text-xl font-semibold mb-4">Shipping</h3>
//           <p><strong>Shipping Charges:</strong> {product.currency} {product.shipping_charges}</p>
//           <p><strong>Delivery Time:</strong> {product.delivery_time}</p>
//           <p><strong>Cash on Delivery:</strong> {product.cash_on_delivery ? "Yes" : "No"}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;

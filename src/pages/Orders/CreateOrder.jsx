import React, { useState } from "react";
import { useGetAllProducts } from "../../hooks/useProduct";
import { useCreateOrder } from "../../hooks/useOrder";
import SearchDropdown from "../../components/SearchDropdown";
import DynamicForm from "../../components/DynamicForm";

const CreateOrder = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const [customerForm, setCustomerForm] = useState({
    customerName: "",
    mobileNumber: "",
  });

  const customerFields = [
    {
      key: "customerName",
      label: "Customer Name *",
      type: "text",
      placeholder: "Enter customer name",
      required: true,
    },
    {
      key: "mobileNumber",
      label: "Mobile Number *",
      type: "text",
      placeholder: "Enter mobile number",
      required: true,
    },
  ];

  const {
    data: productsResponse,
    isLoading,
    isError,
  } = useGetAllProducts({ searchTerm, page: 1, limit: 50 });

  const { mutateAsync: createOrder, isPending: isCreatingOrder } = useCreateOrder();

  const products = productsResponse?.data || [];

  const formattedProducts = products.map((product) => ({
    value: product.product_unique_id,
    label: product.product_name,
    data: product,
  }));

  const handleSelectProduct = (item) => {
    const exists = selectedProducts.some((p) => p.product_unique_id === item.value);
    if (exists) return;

    setSelectedProducts((prev) => [
      ...prev,
      {
        ...item.data,
        quantity: 1,
        base_price: Number(item.data.base_price),
        final_price: Number(item.data.final_price),
      },
    ]);

    setSearchTerm("");
    setShowDropdown(false);
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts((prev) =>
      prev.filter((p) => p.product_unique_id !== productId)
    );
  };

  const handleQuantityChange = (productId, value) => {
    const qty = parseInt(value) || 1;
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p.product_unique_id === productId ? { ...p, quantity: Math.max(1, qty) } : p
      )
    );
  };

  const handleSubmitOrder = async () => {
    const orderData = {
      customer_name: customerForm.customerName.trim(),
      mobile_number: customerForm.mobileNumber.trim(),
      order_type: "Offline",
      payment_method: "UPI",
      payment_status: "Paid",
      order_products: selectedProducts.map((p) => ({
        product_name: p.product_name,
        product_unique_id: p.product_unique_id,
        quantity: p.quantity,
        unit_base_price: p.base_price,
        unit_final_price: p.final_price,
      })),
    };

    try {
      await createOrder(orderData);
      setCustomerForm({ customerName: "", mobileNumber: "" });
      setSelectedProducts([]);
      alert("Order created successfully created!");
    } catch (err) {
      console.error(err);
      alert("Failed to create order");
    }
  };

  const totalAmount = selectedProducts.reduce(
    (sum, p) => sum + p.final_price * p.quantity,
    0
  );

  const isFormValid =
    customerForm.customerName.trim() &&
    customerForm.mobileNumber.trim() &&
    selectedProducts.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white text-center">
              Create New Order
            </h1>
          </div>

          <div className="p-8 space-y-10">
            {/* Customer Details */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Details</h2>
              <DynamicForm
                fields={customerFields}
                formData={customerForm}
                setFormData={setCustomerForm}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              />
            </div>

            {/* Search Product */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Products</h2>
              <SearchDropdown
                value={searchTerm}
                placeholder="Search products..."
                results={showDropdown ? formattedProducts : []}
                onChange={(val) => {
                  setSearchTerm(val);
                  setShowDropdown(val.length > 0);
                }}
                onSearch={(val) => {
                  setSearchTerm(val);
                  setShowDropdown(val.length > 0);
                }}
                onSelect={handleSelectProduct}
                clearResults={() => {
                  setSearchTerm("");
                  setShowDropdown(false);
                }}
              />
              {isLoading && searchTerm && (
                <p className="mt-2 text-sm text-indigo-600">Loading products...</p>
              )}
              {isError && (
                <p className="mt-2 text-sm text-red-600">Error loading products</p>
              )}
            </div>

            {/* Always Visible Product Table */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Order Items ({selectedProducts.length})
              </h3>

              <div className="overflow-x-auto rounded-xl border border-gray-300 shadow">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase">
                        Product
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold uppercase">
                        Price
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold uppercase">
                        Qty
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold uppercase">
                        Total
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold uppercase">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedProducts.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center text-gray-400">
                            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h18v18H3V3zM12 8v8m-4-4h8" />
                            </svg>
                            <p className="text-lg font-medium">No products added yet</p>
                            <p className="text-sm">Search and select products to add them here</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      selectedProducts.map((product) => {
                        const itemTotal = product.final_price * product.quantity;
                        return (
                          <tr key={product.product_unique_id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">
                                {product.product_name}
                              </div>
                              {/* <div className="text-xs text-gray-500">
                                ID: {product.product_unique_id}
                              </div> */}
                            </td>
                            <td className="px-6 py-4 text-center font-semibold">
                              ₹{product.final_price.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <input
                                type="number"
                                min="1"
                                value={product.quantity}
                                onChange={(e) =>
                                  handleQuantityChange(product.product_unique_id, e.target.value)
                                }
                                className="w-20 px-3 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </td>
                            <td className="px-6 py-4 text-center font-bold text-indigo-700">
                              ₹{itemTotal.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => handleRemoveProduct(product.product_unique_id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <svg
                                  className="w-6 h-6"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m6 0h.01"
                                  />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-100 font-bold text-lg">
                      <td colSpan="3" className="px-6 py-4 text-right">
                        Grand Total:
                      </td>
                      <td className="px-6 py-4 text-center text-indigo-700">
                        ₹{totalAmount.toFixed(2)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSubmitOrder}
                disabled={!isFormValid || isCreatingOrder}
                className={`px-10 py-4 rounded-xl font-bold text-white text-lg transition-all ${
                  !isFormValid || isCreatingOrder
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105"
                }`}
              >
                {isCreatingOrder ? "Creating Order..." : "Create Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
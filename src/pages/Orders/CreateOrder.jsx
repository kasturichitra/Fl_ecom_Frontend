import React, { useState } from "react";
import { useGetAllProducts } from "../../hooks/useProduct";
import { useCreateOrder } from "../../hooks/useOrder";
import SearchDropdown from "../../components/SearchDropdown";
import DynamicForm from "../../components/DynamicForm";

const CreateOrder = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  // NEW STATE FOR DynamicForm
  const [customerForm, setCustomerForm] = useState({
    customerName: "",
    mobileNumber: "",
  });

  // DynamicForm field config
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

  const { data: productsResponse, isLoading, isError } = useGetAllProducts({
    searchTerm,
    page: 1,
    limit: 50,
  });

  const { mutateAsync: createOrder, isPending: isCreatingOrder } = useCreateOrder();

  const products = productsResponse?.data || [];

  const formattedProducts = products.map((product) => ({
    value: product.product_unique_id,
    label: product.product_name,
    data: product,
  }));

  const handleSelectProduct = (item) => {
    setSelectedProducts((prev) => {
      const exists = prev.some((p) => p.product_unique_id === item.value);
      return exists ? prev : [...prev, { ...item.data, quantity: 1 }];
    });

    setSearchTerm("");
    setShowDropdown(false);
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts((prev) =>
      prev.filter((p) => p.product_unique_id !== productId)
    );
  };

  const handleQuantityChange = (productId, quantity) => {
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p.product_unique_id === productId
          ? { ...p, quantity: parseInt(quantity) || 1 }
          : p
      )
    );
  };

  const handleSubmitOrder = async () => {
    console.log("handleSubmitOrder");
    const orderData = {
      customer_name: customerForm.customerName,
      mobile_number: customerForm.mobileNumber,
      // static Data
      order_type: "Online",
      payment_method: "UPI",
      payment_status: "Completed",
      products: selectedProducts.map((p) => ({
        product_id: p.product_unique_id,
        quantity: p.quantity,
        price: p.price,
      })),
    };


    console.log("orderData", orderData);

    try {
      console.log("Creating order...");
      await createOrder(orderData);
      setCustomerForm({ customerName: "", mobileNumber: "" });
      setSelectedProducts([]);
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Create Order</h1>

        {/* Customer Details Section (Now DynamicForm) */}
        <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Customer Details
          </h2>

          <DynamicForm
            fields={customerFields}
            formData={customerForm}
            setFormData={setCustomerForm}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          />
        </div>

        {/* Product Details Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Product Details
          </h2>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Search Products
          </label>

          <SearchDropdown
            value={searchTerm}
            placeholder="Search products by name..."
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
        </div>

        {/* Selected Products */}
        {selectedProducts.length > 0 && (
          <div className="mt-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Selected Products
            </h3>

            <div className="space-y-3">
              {selectedProducts.map((product) => (
                <div
                  key={product.product_unique_id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div>
                    <p className="font-semibold text-gray-800">{product.product_name}</p>
                    <p className="text-sm text-gray-600">
                      ID: {product.product_unique_id} | Price: ₹{product.price}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={product.quantity}
                        onChange={(e) =>
                          handleQuantityChange(product.product_unique_id, e.target.value)
                        }
                        className="border p-2 rounded-lg w-20 text-center"
                      />
                    </div>

                    <button
                      onClick={() => handleRemoveProduct(product.product_unique_id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save Order */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => handleSubmitOrder()}
            disabled={isCreatingOrder}
            className={`px-8 py-3 rounded-lg font-semibold text-white transition ${isCreatingOrder
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
              }`}
          >
            {isCreatingOrder ? "Creating Order..." : "Save Order"}
          </button>
        </div>

        {isLoading && searchTerm && (
          <p className="text-sm text-gray-500 mt-2">Loading products...</p>
        )}
        {isError && (
          <p className="text-sm text-red-500 mt-2">Error loading products</p>
        )}
      </div>
    </div>
  );
};

export default CreateOrder;

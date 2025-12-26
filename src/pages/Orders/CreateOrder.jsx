import React, { useState, useEffect } from "react";
import { useGetAllProducts } from "../../hooks/useProduct";
import { useCreateOrder } from "../../hooks/useOrder";
import SearchDropdown from "../../components/SearchDropdown";
import QrScanner from "../../components/QrScanner";
import ScannedProductModal from "../../components/ScannedProductModal";
import {
  FiMaximize,
  FiX,
  FiTrash2,
  FiEdit,
  FiUser,
  FiSmartphone,
  FiMapPin,
  FiSearch,
  FiShoppingBag,
  FiSave,
} from "react-icons/fi";
import toast from "react-hot-toast";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/Table";

const CreateOrder = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  // QR Scanner States
  const [showScanner, setShowScanner] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [scannedProduct, setScannedProduct] = useState(null);

  // Customer Form State - Added address as per UI request
  const [customerForm, setCustomerForm] = useState({
    customerName: "",
    mobileNumber: "",
    address: "",
  });

  // Global Order Discount
  const [orderDiscount, setOrderDiscount] = useState(0);
  // Held orders from localStorage
  const [heldOrders, setHeldOrders] = useState([]);
  const [editingHeldId, setEditingHeldId] = useState(null);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState(null);
  const [heldSearch, setHeldSearch] = useState("");

  const { data: productsResponse, isLoading, isError } = useGetAllProducts({ searchTerm });

  const { mutateAsync: createOrder, isPending: isCreatingOrder } = useCreateOrder({
    onSuccess: () => {
      setCustomerForm({ customerName: "", mobileNumber: "", address: "" });
      setSelectedProducts([]);
      setOrderDiscount(0);

      // If we were editing a held order, remove it from storage
      if (editingHeldId) {
        try {
          const HELD_ORDERS_KEY = "heldOrders";
          const existing = JSON.parse(localStorage.getItem(HELD_ORDERS_KEY)) || [];
          const filtered = existing.filter((h) => h.id !== editingHeldId);
          localStorage.setItem(HELD_ORDERS_KEY, JSON.stringify(filtered));
          setHeldOrders(filtered);
          setEditingHeldId(null);
        } catch (err) {
          console.error("Error removing held order after create:", err);
        }
      }
    },
  });

  const products = productsResponse?.data || [];

  const formattedProducts = products?.map((product) => ({
    value: product?.product_unique_id,
    label: product?.product_name,
    data: product,
  }));

  const handleSelectProduct = (item) => {
    const exists = selectedProducts?.some((p) => p?.product_unique_id === item?.value);
    if (exists) {
      toast.error("Product already added!");
      return;
    }

    const basePrice = Number(item?.data?.base_price) || 0;
    const finalPrice = Number(item?.data?.final_price) || basePrice;

    setSelectedProducts((prev) => [
      ...prev,
      {
        ...item.data,
        quantity: 1,
        // Store original prices for calculation
        base_price: basePrice,
        // original_final_price: finalPrice,
        // final_price: finalPrice,
        // discount: 0,
      },
    ]);

    setSearchTerm("");
    setShowDropdown(false);
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts((prev) => prev?.filter((p) => p?.product_unique_id !== productId));
  };

  const handleQuantityChange = (productId, value) => {
    const qty = parseInt(value) || 1;
    setSelectedProducts((prev) =>
      prev?.map((p) => (p?.product_unique_id === productId ? { ...p, quantity: Math.max(1, qty) } : p))
    );
  };

  const handleProductDiscountChange = (productId, value) => {
    // strict check for numbers only
    if (value === "") {
      setSelectedProducts((prev) =>
        prev?.map((p) => {
          if (p?.product_unique_id === productId) {
            return { ...p };
          }
          return p;
        })
      );
      return;
    }

    if (!/^\d*$/.test(value)) return;

    const discount = Math.min(Math.max(parseInt(value, 10), 0), 100);

    setSelectedProducts((prev) =>
      prev?.map((p) => {
        // console.log("P in map:", p);
        // console.log("Selected Product Id:", productId);
        if (p?.product_unique_id === productId) {
          return {
            ...p,
            additional_discount_percentage: discount,
            additional_discount_type: "percentage",
            post_discount_final_price: p?.discounted_price - p?.discounted_price * (discount / 100),
            // final_price: newFinalPrice,
          };
        }
        return p;
      })
    );
  };

  const handleGlobalDiscountChange = (value) => {
    if (value === "") {
      setOrderDiscount(0);
      return;
    }
    if (!/^\d*$/.test(value)) return;
    const discount = Math.min(Math.max(parseInt(value, 10), 0), 100);
    setOrderDiscount(discount);
  };

  const handleSubmitOrder = async () => {
    // console.log("Selected Products before API call:", selectedProducts);
    const orderData = {
      customer_name: customerForm?.customerName.trim(),
      mobile_number: customerForm?.mobileNumber.trim(),
      offline_address: customerForm?.address.trim(),
      order_type: "Offline",
      payment_method: "UPI",
      payment_status: "Paid",
      shipping_charges: 0,
      is_from_cart: false,
      order_products: selectedProducts?.map((p) => ({
        product_unique_id: p?.product_unique_id,
        product_name: p?.product_name,
        quantity: p?.quantity,
        unit_base_price: p?.base_price,
        unit_discount_price: p?.discount_price || 0,
        unit_discounted_price: p?.discounted_price,
        unit_tax_value: p?.tax_value || 0,
        unit_final_price: p?.final_price,
        additional_discount_percentage: p?.additional_discount_percentage || 0,
        additional_discount_amount: p?.additional_discount_amount || 0,
        additional_discount_type: p?.additional_discount_type || null,
        cgst: p?.cgst || 0,
        sgst: p?.sgst || 0,
        igst: p?.igst || 0,
      })),
      // Order-level additional discount
      additional_discount_percentage: orderDiscount,
      additional_discount_amount: 0,
      additional_discount_type: orderDiscount > 0 ? "percentage" : null,
    };

    // console.log("Order Data before API call:", orderData);

    await createOrder(orderData);
  };

  // QR Handler
  const handleScan = (code) => {
    if (!code) return;

    try {
      const parsedProduct = JSON.parse(code);
      if (parsedProduct && (parsedproduct?.product_unique_id || parsedproduct?.id) && parsedproduct?.product_name) {
        setScannedProduct(parsedProduct);
        setShowScanner(false);
        setShowProductModal(true);
        toast.success("Product found!");
      } else {
        toast.error("Invalid QR Code: Missing product details");
      }
    } catch (error) {
      console.error("QR Parse Error", error);
      toast.error("Scanned code is not a valid Product JSON");
    }
  };

  const handleAddScannedProduct = (e) => {
    e.preventDefault();
    if (scannedProduct) {
      handleSelectProduct({
        value: scannedproduct?.product_unique_id,
        label: scannedproduct?.product_name,
        data: {
          ...scannedProduct,
          base_price: scannedproduct?.base_price || scannedproduct?.final_price,
          final_price: scannedproduct?.final_price || scannedproduct?.base_price,
        },
      });
      setShowProductModal(false);
      setScannedProduct(null);
    }
  };

  const handleHoldOrder = () => {
  try {
    const HELD_ORDERS_KEY = "heldOrders";

    const existing = JSON.parse(localStorage.getItem(HELD_ORDERS_KEY)) || [];

    // Helper to merge product lists (sum quantities if product exists)
    const mergeProducts = (existingProducts = [], newProducts = []) => {
      const map = {};
      existingProducts.forEach((p) => {
        map[p.product_unique_id] = { ...p };
      });
      newProducts.forEach((p) => {
        const id = p.product_unique_id;
        if (map[id]) {
          const existingQty = Number(map[id].quantity || 0);
          const newQty = Number(p.quantity || 0);
          map[id] = { ...map[id], ...p, quantity: existingQty + newQty };
        } else {
          map[id] = { ...p };
        }
      });
      return Object.values(map);
    };

    // If editing an existing held order, update that entry
    if (editingHeldId) {
      const idx = existing.findIndex((h) => h.id === editingHeldId);
      if (idx !== -1) {
        // When editing an existing held order we should REPLACE the products
        // with the current selectedProducts (so removed items are removed).
        const updated = {
          ...existing[idx],
          customerForm: { ...customerForm },
          selectedProducts: (selectedProducts || []).map((p) => ({ ...p })),
          orderDiscount,
          modifiedAt: new Date().toISOString(),
        };
        const newList = [...existing];
        newList[idx] = updated;
        localStorage.setItem(HELD_ORDERS_KEY, JSON.stringify(newList));
        setHeldOrders(newList);
        setEditingHeldId(null);
        // Reset form
        setCustomerForm({ customerName: "", mobileNumber: "", address: "" });
        setSelectedProducts([]);
        setOrderDiscount(0);
        toast.success("Held order updated");
        return;
      }
    }

    // Note: we no longer auto-merge by mobile. Creating a held order will
    // always create a new entry (unless editing an existing held order).

    // No existing entry — create a new held order
    const held = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      customerForm: { ...customerForm },
      selectedProducts: selectedProducts.map((p) => ({ ...p })),
      orderDiscount,
    };

    const newList = [...existing, held];
    localStorage.setItem(HELD_ORDERS_KEY, JSON.stringify(newList));

    // update local state so table refreshes immediately
    setHeldOrders(newList);

    // Reset local state similar to successful create
    setCustomerForm({ customerName: "", mobileNumber: "", address: "" });
    setSelectedProducts([]);
    setOrderDiscount(0);

    toast.success("Order held successfully");
  } catch (err) {
    console.error("Hold order error:", err);
    toast.error("Failed to hold order. Please try again.");
  }
};

  // Load held orders from localStorage
  const loadHeldOrders = () => {
    try {
      const existing = JSON.parse(localStorage.getItem("heldOrders")) || [];
      setHeldOrders(existing);
    } catch (err) {
      console.error("Failed to load held orders:", err);
      setHeldOrders([]);
    }
  };

  useEffect(() => {
    loadHeldOrders();

    const onStorage = (e) => {
      if (e.key === "heldOrders") loadHeldOrders();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleDeleteHeld = (id) => {
    try {
      const existing = JSON.parse(localStorage.getItem("heldOrders")) || [];
      const filtered = existing.filter((h) => h.id !== id);
      localStorage.setItem("heldOrders", JSON.stringify(filtered));
      setHeldOrders(filtered);
      toast.success("Held order deleted");
    } catch (err) {
      console.error("Delete held order error:", err);
      toast.error("Failed to delete held order");
    }
  };

  const handleEditHeld = (id) => {
    const held = heldOrders.find((h) => h.id === id);
    if (!held) {
      toast.error("Held order not found");
      return;
    }

    // Load into form
    setCustomerForm({ ...held.customerForm });
    setSelectedProducts(held.selectedProducts.map((p) => ({ ...p })));
    setOrderDiscount(held.orderDiscount || 0);
    setEditingHeldId(id);
    // Scroll to top so user can see the form
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast.success("Held order loaded. You can edit and create it now.");
  };

  // Calculations
  const subTotal = selectedProducts.reduce(
    (sum, p) => sum + (p?.post_discount_final_price || p?.final_price) * p?.quantity,
    0
  );
  const finalTotal = subTotal * (1 - orderDiscount / 100);

  const isFormValid =
    customerForm?.customerName.trim() && customerForm?.mobileNumber.trim() && selectedProducts?.length > 0;

  const columns = [
    { field: "id", headerName: "ID", width: 120 },
    { field: "customerName", headerName: "Customer", width: 220 },
    { field: "mobile", headerName: "Mobile", width: 150 },
    { field: "items", headerName: "Items", width: 100 },
    { field: "createdAt", headerName: "Created At", width: 200 },
    { field: "total", headerName: "Total (₹)", width: 140 },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      sortable: false,
      renderCell: (params) => {
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleEditHeld(params.row.id)}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm flex items-center gap-2"
            >
              <FiEdit /> Edit
            </button>
            <button
              onClick={() => handleDeleteHeld(params.row.id)}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm flex items-center gap-2"
            >
              <FiTrash2 /> Delete
            </button>
          </div>
        );
      },
    },
  ];

  const filteredHeldOrders = heldOrders.filter((h) => {
    const q = heldSearch?.toString().trim().toLowerCase();
    if (!q) return true;
    const name = (h.customerForm?.customerName || "").toString().toLowerCase();
    const mobile = (h.customerForm?.mobileNumber || "").toString().toLowerCase();
    return name.includes(q) || mobile.includes(q);
  });

  const rows = filteredHeldOrders.map((h) => {
    const total = (h.selectedProducts || []).reduce(
      (sum, p) => sum + (Number(p?.post_discount_final_price) || Number(p?.final_price) || 0) * (p?.quantity || 1),
      0
    );
    const final = total * (1 - (h.orderDiscount || 0) / 100);
    return {
      id: h.id,
      customerName: h.customerForm?.customerName || "-",
      mobile: h.customerForm?.mobileNumber || "-",
      items: (h.selectedProducts || []).length,
      createdAt: h.createdAt || "-",
      total: final.toFixed(2),
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6 font-sans text-gray-800">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-6">
          <PageHeader
            title="Create New Offline Order"
            subtitle="Manage all your store orders from here"
            createPermission="order:create"

          />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 h-full">
          {/* LEFT PANEL - Customer Details (30%) */}
          <div className="w-full lg:w-[30%] h-fit">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <FiUser size={20} />
                </div>
                <h2 className="text-lg font-bold text-gray-800">Customer Details</h2>
              </div>

              <div className="space-y-5">
                {/* Customer Name */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Customer Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter full name"
                      required
                      value={customerForm.customerName}
                      onChange={(e) => setCustomerForm({ ...customerForm, customerName: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400 text-sm font-medium hover:bg-white"
                    />
                  </div>
                </div>

                {/* Customer Mobile */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibol
                  d text-gray-700 ml-1">Mobile Number <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <FiSmartphone className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="number" // Changed to number as requested
                      placeholder="Enter mobile number"
                      required
                      pattern="[0-9]{10}"
                      value={customerForm.mobileNumber}
                      onChange={(e) => setCustomerForm({ ...customerForm, mobileNumber: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400 text-sm font-medium hover:bg-white"
                    />
                  </div>
                </div>

                {/* Customer Address */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Customer Address</label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-3 text-gray-400" />
                    <textarea
                      rows="3"
                      placeholder="Enter complete address"
                      value={customerForm.address}
                      onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400 text-sm font-medium hover:bg-white resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Hint/Status */}
              <div className="mt-6 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs text-blue-700 text-center font-medium">
                  {!isFormValid ? "Please fill all required fields to proceed." : "Ready to create order."}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL - Order Products (70%) */}
          <div className="w-full lg:w-[70%] flex flex-col gap-6">
            {/* Top Row: Search & Scan */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative grow z-20">
                {/* Z-index high for dropdown */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                  <FiSearch size={22} />
                </div>
                <div className="w-full">
                  <SearchDropdown
                    value={searchTerm}
                    placeholder="Search box for products..."
                    results={showDropdown ? formattedProducts : []}
                    onChange={(val) => {
                      setSearchTerm(val);
                      setShowDropdown(val?.length > 0);
                    }}
                    onSearch={(val) => {
                      setSearchTerm(val);
                      setShowDropdown(val?.length > 0);
                    }}
                    onSelect={handleSelectProduct}
                    clearResults={() => {
                      setSearchTerm("");
                      setShowDropdown(false);
                    }}
                    customInputClass="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-lg transition-all"
                  />
                </div>
              </div>

              <button
                onClick={() => setShowScanner(true)}
                className="shrink-0 bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-gray-200 flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <FiMaximize size={20} />
                <span>Scan QR</span>
              </button>
            </div>

            {/* Products List Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden min-h-[500px]">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-xl font-bold text-gray-800">Order Products</h2>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                  {selectedProducts.length} Items
                </span>
              </div>

              <div className="p-4 overflow-y-auto flex-1 space-y-3 custom-scrollbar">
                {selectedProducts.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60 min-h-[300px]">
                    <FiShoppingBag size={64} className="mb-4" />
                    <p className="text-lg font-medium">Your cart is empty</p>
                    <p className="text-sm">Search or scan products to begin</p>
                  </div>
                ) : (
                  selectedProducts.map((product) => {
                    const itemTotal =
                      (Number(product?.post_discount_final_price) || product?.final_price) * product?.quantity;
                    // Determine placeholder color based on ID for some visual variety
                    const hue = (parseInt(product?.product_unique_id) || 0) % 360;

                    return (
                      <div
                        key={product?.product_unique_id}
                        className="group bg-white rounded-lg border border-gray-200 p-3 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row gap-3 items-center"
                      >
                        {/* Product Details Placeholder */}
                        {/* <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 font-bold text-lg uppercase">
                          {product?.product_name.charAt(0)}
                        </div> */}

                        <img 
                          src={product?.product_image?.low || "https://placehold.co/400x400/indigo/white?text=Product"}
                          className="object-cover size-12 rounded-md"
                          alt={product?.product_name}
                        />

                        {/* Info */}
                        <div className="flex-1 text-center sm:text-left">
                          <h3 className="font-bold text-gray-800 text-sm leading-tight mb-1">
                            {product?.product_name}
                          </h3>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-4 sm:gap-6 bg-gray-50 p-2 rounded-xl">
                          {/* Quantity */}
                          <div className="flex flex-col items-center">
                            <label className="text-[10px] text-gray-500 font-bold uppercase mb-1">Qty</label>
                            <input
                              type="number"
                              min="1"
                              value={product?.quantity}
                              onChange={(e) => handleQuantityChange(product?.product_unique_id, e.target.value)}
                              className="w-16 text-center font-bold text-gray-800 bg-white border border-gray-200 rounded-lg py-1 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                          </div>

                          {/* Discount */}
                          <div className="flex flex-col items-center">
                            <label className="text-[10px] text-gray-500 font-bold uppercase mb-1">Disc %</label>
                            <input
                              type="text"
                              value={
                                product?.additional_discount_percentage === 0
                                  ? ""
                                  : product?.additional_discount_percentage || ""
                              }
                              placeholder="0"
                              onChange={(e) => handleProductDiscountChange(product?.product_unique_id, e.target.value)}
                              className="w-16 text-center font-bold text-orange-600 bg-white border border-gray-200 rounded-lg py-1 focus:ring-2 focus:ring-orange-500 outline-none"
                            />
                          </div>

                          {/* Price Display */}
                          <div className="flex flex-col items-end min-w-20">
                            <span className="text-xs text-gray-400 strike-through">
                              {(product?.final_price * product?.quantity).toFixed(2)}
                            </span>
                            <span className="text-lg font-bold text-blue-700">₹{itemTotal.toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => handleRemoveProduct(product?.product_unique_id)}
                          className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <FiTrash2 size={20} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Order Summary & Actions */}
              <div className="bg-gray-50 border-t border-gray-200 p-6">
                <div className="flex flex-col items-end gap-3">
                  <div className="text-right space-y-2 w-full max-w-sm">
                    <div className="flex justify-between items-center text-gray-600 text-sm">
                      <span>Subtotal:</span>
                      <span className="font-medium text-gray-800">₹{subTotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center gap-4">
                      <label className="text-sm font-semibold text-gray-600 whitespace-nowrap">
                        Additional Discount (%):
                      </label>
                      <div className="relative w-24">
                        <input
                          type="text"
                          value={orderDiscount === 0 ? "" : orderDiscount}
                          placeholder="0"
                          onChange={(e) => handleGlobalDiscountChange(e.target.value)}
                          className="w-full pl-2 pr-6 py-1 bg-white border border-gray-300 rounded text-right font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                        <span className="absolute right-2 top-1 text-gray-500 font-bold text-xs">%</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xl font-bold text-gray-900 border-t pt-2 border-gray-200">
                      <span className="text-base text-gray-500 font-normal">Total:</span>
                      <span className="text-blue-600">₹{finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleHoldOrder}
                    disabled={!isFormValid || isCreatingOrder}
                    className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg transition-all flex items-center justify-center gap-3 ${
                      !isFormValid || isCreatingOrder
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200 hover:-translate-y-1"
                    }`}
                  >
                    {isCreatingOrder ? (
                      <>Processing...</>
                    ) : (
                      <>
                        Hold
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleSubmitOrder}
                    disabled={!isFormValid || isCreatingOrder}
                    className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg transition-all flex items-center justify-center gap-3 ${
                      !isFormValid || isCreatingOrder
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200 hover:-translate-y-1"
                    }`}
                  >
                    {isCreatingOrder ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <FiSave size={24} /> Create Order
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">Scan Product QR</h3>
              <button
                onClick={() => setShowScanner(false)}
                className="text-gray-500 hover:text-red-600 transition p-2 rounded-full hover:bg-gray-100"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="p-6 flex flex-col items-center justify-center min-h-[300px] bg-gray-900">
              <QrScanner onScan={handleScan} />
              <p className="mt-4 text-gray-400 text-sm">Point your camera at a product QR code</p>
            </div>
          </div>
        </div>
      )}

      {/* Product Found Modal */}
      <ScannedProductModal
        isOpen={showProductModal}
        scannedProduct={scannedProduct}
        onClose={() => setShowProductModal(false)}
        onAdd={handleAddScannedProduct}
      />

      {/* show holding data in table below (only when there are held orders) */}
      {heldOrders && heldOrders.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-3 text-lg font-bold">Held Orders</h3>

          <div className="mb-3">
            <div className="relative w-full max-w-sm">
              <input
                type="text"
                placeholder="Search by customer name or mobile"
                value={heldSearch}
                onChange={(e) => {
                  setHeldSearch(e.target.value);
                  setPage(0);
                }}
                className="w-full pl-3 pr-10 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
              {heldSearch && (
                <button
                  onClick={() => setHeldSearch("")}
                  aria-label="Clear search"
                  title="Clear"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gray-100 rounded-md text-sm text-gray-600 hover:bg-gray-200"
                >
                  <FiX />
                </button>
              )}
            </div>
          </div>  

          <DataTable
            rows={rows}
            columns={columns}
            getRowId={(r) => r.id}
            page={page}
            pageSize={pageSize}
            totalCount={rows.length}
            setCurrentPage={setPage}
            setPageSize={setPageSize}
            sort={sort}
            setSort={setSort}
          />
        </div>
      )}
    </div>
  );
};

export default CreateOrder;

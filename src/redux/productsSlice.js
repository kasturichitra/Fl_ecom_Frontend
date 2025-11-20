// src/redux/productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllProductsApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
} from "../ApiServices/productService";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

// =========================== GET ALL ===========================
export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async ({ token, tenantId }, { rejectWithValue }) => {
    try {
      const response = await getAllProductsApi(token, tenantId);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch products");
    }
  }
);

// =========================== CREATE ===========================
export const createProduct = createAsyncThunk(
  "products/create",
  async ({ body, token, tenantId }, { rejectWithValue }) => {
    try {
      const response = await createProductApi(body, token, tenantId); // JSON body
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to create product");
    }
  }
);

// =========================== UPDATE ===========================
export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, formData, token, tenantId }, { rejectWithValue }) => {
    try {
      const response = await updateProductApi(id, formData, token, tenantId); // multipart/form-data
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to update product");
    }
  }
);

// =========================== DELETE ===========================
export const deleteProduct = createAsyncThunk(
  "products/delete",
  async ({ id, token, tenantId }, { rejectWithValue }) => {
    try {
      await deleteProductApi(id, token, tenantId);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete");
    }
  }
);

// =========================== SLICE ===========================
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      // UPDATE
      .addCase(updateProduct.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.items.findIndex(
          (p) => p.product_unique_id === updated.product_unique_id
        );
        if (index !== -1) state.items[index] = updated;
      })

      // DELETE
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (p) => p.product_unique_id !== action.payload
        );
      });
  },
});

export default productSlice.reducer;

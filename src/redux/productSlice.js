// src/redux/productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllProductsApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
} from "../ApiServices/productService";

/* --------------------------
   SAFE: Normalize API array
--------------------------- */
const ensureArray = (data) => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") return [data];
  return [];
};

/* --------------------------
   GET ALL PRODUCTS
--------------------------- */
export const fetchProducts = createAsyncThunk(
  "products/",
  async ({ token, tenantId }, { rejectWithValue }) => {
    try {
      const res = await getAllProductsApi(token, tenantId);
      return ensureArray(res?.data?.data);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load products"
      );
    }
  }
);

/* --------------------------
   CREATE PRODUCT
--------------------------- */
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async ({ token, tenantId, formData }, { rejectWithValue }) => {
    try {
      const res = await createProductApi(formData, token, tenantId);
      return res?.data?.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create product"
      );
    }
  }
);

/* --------------------------
   UPDATE PRODUCT
--------------------------- */
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ uniqueId, formData, token, tenantId }, { rejectWithValue }) => {
    try {
      const res = await updateProductApi(uniqueId, formData, token, tenantId);
      return res?.data?.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update product"
      );
    }
  }
);

/* --------------------------
   DELETE PRODUCT
--------------------------- */
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async ({ uniqueId, token, tenantId }, { rejectWithValue }) => {
    try {
      await deleteProductApi(uniqueId, token, tenantId);
      return uniqueId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete product"
      );
    }
  }
);

/* --------------------------
   SLICE
--------------------------- */
const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },

  reducers: {
    clearProductError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /* FETCH */
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = ensureArray(action.payload);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.items = [];
      })

      /* CREATE */
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload) {
          state.items.push(action.payload);
        }
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* UPDATE */
      .addCase(updateProduct.fulfilled, (state, action) => {
        const updated = action.payload;
        if (!updated) return;

        const index = state.items.findIndex(
          (prod) => prod.products_unique_ID === updated.products_unique_ID
        );

        if (index !== -1) {
          state.items[index] = updated;
        }
      })

      /* DELETE */
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (prod) => prod.products_unique_ID !== action.payload
        );
      });
  },
});

export const { clearProductError } = productSlice.actions;
export default productSlice.reducer;

// src/redux/brandSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createBrandApi,
  getAllBrandApi,
  updateBrandApi,
  deleteBrandApi,
} from "../ApiServices/brandService";

/* --------------------------
   SAFE: Normalize API array
--------------------------- */
const ensureArray = (data) => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") return [data];
  return [];
};

/* --------------------------
   GET ALL BRANDS
--------------------------- */
export const fetchBrands = createAsyncThunk(
  "brands/fetchBrands",
  async ({ token, tenantId }, { rejectWithValue }) => {
    try {
      const res = await getAllBrandApi(token, tenantId);
      const list = ensureArray(res?.data?.data);
      console.log(list)
      return list;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load brands");
    }
  }
);

/* --------------------------
   CREATE BRAND
--------------------------- */
export const createBrand = createAsyncThunk(
  "brands/createBrand",
  async ({ token, tenantId, formData }, { rejectWithValue }) => {
    console.log(tenantId,"id")
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": ", pair[1]);
    }

    console.log(tenantId)
    try {
      const res = await createBrandApi(formData, token, tenantId);
      return res?.data?.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create brand");
    }
  }
);

/* --------------------------
   UPDATE BRAND
--------------------------- */
export const updateBrand = createAsyncThunk(
  "brands/updateBrand",
  async ({ uniqueId, formData, token, tenantId }, { rejectWithValue }) => {
    console.log(uniqueId,"mongodb")
    try {
      const res = await updateBrandApi(uniqueId, formData, token, tenantId);
      return res?.data?.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update brand");
    }
  }
);

/* --------------------------
   DELETE BRAND
--------------------------- */
export const deleteBrand = createAsyncThunk(
  "brands/deleteBrand",
  async ({ uniqueId, token, tenantId }, { rejectWithValue }) => {
    try {
      await deleteBrandApi(uniqueId, token, tenantId);
      return uniqueId; // return ID
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete brand");
    }
  }
);

/* --------------------------
   SLICE
--------------------------- */
const brandSlice = createSlice({
  name: "brands",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearBrandError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /* FETCH */
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.items = ensureArray(action.payload);
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.items = [];
      })

      /* CREATE */
      .addCase(createBrand.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBrand.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) state.items.push(action.payload);
      })
      .addCase(createBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* UPDATE */
      .addCase(updateBrand.fulfilled, (state, action) => {
        if (!action.payload) return;

        const index = state.items.findIndex(
          (b) => b.brand_unique_id === action.payload.brand_unique_id
        );

        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      /* DELETE */
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (b) => b.brand_unique_id !== action.payload
        );
      });
  },
});

export const { clearBrandError } = brandSlice.actions;
export default brandSlice.reducer;

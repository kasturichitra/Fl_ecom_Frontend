import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllIndustryApi,
  createIndustryApi,
  deleteIndustryApi,
  updateIndustryApi,
} from "../ApiServices/industryService";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

// =========================== GET ALL ===========================
export const fetchIndustryTypes = createAsyncThunk(
  "industryType/search",
  async ({ token, tenantId }, { rejectWithValue }) => {
    try {
      const response = await getAllIndustryApi(token, tenantId);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch");
    }
  }
);

// =========================== CREATE ===========================
export const createIndustryType = createAsyncThunk(
  "industryTypes/",
  async ({ formData, token, tenantId }, { rejectWithValue }) => {
     console.log(formData,token,tenantId)
    try {
      const response = await createIndustryApi(formData, token, tenantId);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to create");
    }
  }
);

// =========================== DELETE ===========================
export const deleteIndustryType = createAsyncThunk(
  "industryTypes/delete",
  async ({ uniqueId, token, tenantId }, { rejectWithValue }) => {
    try {
      await deleteIndustryApi(uniqueId, token, tenantId);
      return uniqueId; // return deleted ID to reducer
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete");
    }
  }
);

// =========================== UPDATE ===========================
export const updateIndustryType = createAsyncThunk(
  "industryTypes/update",
  async ({ originalId, updatedData, token, tenantId }, { rejectWithValue }) => {
    try {
      const response = await updateIndustryApi(
        originalId,
        updatedData,
        token,
        tenantId
      );
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to update");
    }
  }
);

// =========================== SLICE ===========================
const industryTypeSlice = createSlice({
  name: "industryTypes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ===== GET =====
      .addCase(fetchIndustryTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIndustryTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchIndustryTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== CREATE =====
      .addCase(createIndustryType.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(createIndustryType.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ===== DELETE (FIXED ID) =====
      .addCase(deleteIndustryType.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (i) => i.industry_unique_id !== action.payload
        );
      })
      .addCase(deleteIndustryType.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ===== UPDATE (FIXED ID) =====
      .addCase(updateIndustryType.fulfilled, (state, action) => {
        const updatedItem = action.payload;
        const index = state.items.findIndex(
          (i) => i.industry_unique_id === updatedItem.industry_unique_id
        );
        if (index !== -1) {
          state.items[index] = updatedItem;
        }
      })
      .addCase(updateIndustryType.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default industryTypeSlice.reducer;

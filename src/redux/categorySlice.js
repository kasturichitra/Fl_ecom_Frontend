import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import {
  getAllCategoryApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from "../ApiServices/categoryService";

// ------------------------------------------------------
// 🔵 GET ALL CATEGORIES
// ------------------------------------------------------
export const fetchCategories = createAsyncThunk(
  "categories/",
  async ({ token, tenantId }, { rejectWithValue }) => {
    try {
      const res = await getAllCategoryApi(token, tenantId);
      return res?.data?.data ?? [];
    } catch (error) {
      console.error("❌ Fetch Categories Error:", error);
      return rejectWithValue(error?.response?.data?.message ?? "Failed to fetch categories");
    }
  }
);

// ------------------------------------------------------
// 🟢 CREATE CATEGORY
// ------------------------------------------------------
export const createCategory = createAsyncThunk(
  "categories/create",
  async ({ formData, token, tenantId }, { rejectWithValue }) => {
    // Debug: Log all FormData values
    for (let pair of formData.entries()) {
    }

    try {
      const res = await createCategoryApi(formData, token, tenantId);
      return res?.data?.data ?? null;
    } catch (error) {
      console.error("❌ Create Category Error:", error);
      return rejectWithValue(error?.response?.data?.message ?? "Failed to create category");
    }
  }
);

// ------------------------------------------------------
// 🟡 UPDATE CATEGORY
// ------------------------------------------------------
// http://10.1.1.156:3000/category/ME1
export const updateCategory = createAsyncThunk(
  "category/updated",
  async ({ uniqueId, formData, token, tenantId }, { rejectWithValue }) => {
    try {
      const res = await updateCategoryApi(uniqueId, formData, token, tenantId);
      return res?.data?.data ?? null;
    } catch (error) {
      console.error("❌ Update Category Error:", error);
      return rejectWithValue(error?.response?.data?.message ?? "Failed to update category");
    }
  }
);

// ------------------------------------------------------
// 🔴 DELETE CATEGORY
// ------------------------------------------------------
// http://10.1.1.156:3000/category/as
export const deleteCategory = createAsyncThunk(
  "category/delete",
  async ({ uniqueId, token, tenantId }, { rejectWithValue }) => {
    try {
      await deleteCategoryApi(uniqueId, token, tenantId);
      return uniqueId ?? "";
    } catch (error) {
      console.error("❌ Delete Category Error:", error);
      return rejectWithValue(error?.response?.data?.message ?? "Failed to delete category");
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

// ------------------------------------------------------
// SLICE
// ------------------------------------------------------
const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      // ------------------------------------------------------
      // GET ALL
      // ------------------------------------------------------
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload ?? [];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error occurred while fetching categories";
      })

      // ------------------------------------------------------
      // CREATE
      // ------------------------------------------------------
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) state.items.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error occurred while creating category";
      })

      // ------------------------------------------------------
      // UPDATE  
      // ------------------------------------------------------
      .addCase(updateCategory.fulfilled, (state, action) => {
        const updated = action.payload;
        if (!updated) return;

        const index = state.items.findIndex(
          (cat) => cat?.category_unique_id === updated?.category_unique_id
        );

        if (index !== -1) {
          state.items[index] = {
            ...state.items[index],
            ...updated,
            attributes: updated?.attributes ?? state.items[index]?.attributes ?? [],
          };
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.error = action.payload ?? "Error occurred while updating category";
      })

      // ------------------------------------------------------
      // DELETE
      // ------------------------------------------------------
      .addCase(deleteCategory.fulfilled, (state, action) => {
        const id = action.payload;
        state.items = state.items.filter(
          (cat) => cat?.category_unique_id !== id
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.error = action.payload ?? "Error occurred while deleting category";
      });
  },
});

export const selectCategories = createSelector(
  (state) => state.categories.items,
  (items) => Array.isArray(items) ? items : []
);

export const selectCategoriesLoading = (state) => state.categories.loading;
export const selectCategoriesError = (state) => state.categories.error;

export default categorySlice.reducer;

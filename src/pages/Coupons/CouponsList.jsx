import { useCallback, useEffect, useRef, useState } from "react";

import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";
import DataTable from "../../components/Table.jsx";
import ColumnVisibilitySelector from "../../components/ColumnVisibilitySelector.jsx";
import { DropdownFilter } from "../../components/DropdownFilter.jsx";

import { useGetAllCoupons } from "../../hooks/useCoupons.js";
import { DEBOUNCED_DELAY, COUPON_STATUS_OPTIONS } from "../../lib/constants.js";
import { useCouponTableHeadersStore } from "../../stores/CouponTableHeadersStore.js";

import useDebounce from "../../hooks/useDebounce.js";

const CouponsList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [activeStatus, setActiveStatus] = useState("");
    const [sort, setSort] = useState("createdAt:desc");

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const { couponHeaders, updateTableHeaders } = useCouponTableHeadersStore();

    const handleClickOutside = useCallback((event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [handleClickOutside]);

    const debouncedSearchTerm = useDebounce(searchTerm, DEBOUNCED_DELAY);

    const {
        data: coupons,
        isLoading: loading,
        isError: error,
    } = useGetAllCoupons({
        search: debouncedSearchTerm,
        page: currentPage + 1,
        limit: pageSize,
        sort,
        status: activeStatus || undefined,
    });

    const columns = [
        {
            field: "coupon_code",
            headerName: "COUPON CODE",
            flex: 1,
            renderCell: (params) => (
                <span className="font-mono text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    {params?.value || "N/A"}
                </span>
            ),
        },
        {
            field: "coupon_type",
            headerName: "COUPON TYPE",
            flex: 1,
            renderCell: (params) => <span className="text-gray-700">{params?.value || "N/A"}</span>,
        },
        {
            field: "discount",
            headerName: "DISCOUNT",
            flex: 1,
            renderCell: (params) => {
                if (params?.row?.discount_percentage) return `${params.row.discount_percentage}%`;
                if (params?.row?.discount_amount) return `₹${params.row.discount_amount}`;
                return "N/A";
            },
        },
        {
            field: "min_order_amount",
            headerName: "MIN ORDER",
            flex: 1,
            renderCell: (params) => (params?.value ? `₹${params.value}` : "N/A"),
        },
        {
            field: "max_discount_amount",
            headerName: "MAX DISCOUNT",
            flex: 1,
            renderCell: (params) => (params?.value ? `₹${params.value}` : "N/A"),
        },
        {
            field: "apply_on",
            headerName: "APPLY ON",
            flex: 1,
            renderCell: (params) => <span className="text-gray-600">{params?.value || "N/A"}</span>,
        },
        {
            field: "total_useage_limit",
            headerName: "USAGE LIMIT",
            flex: 1,
            renderCell: (params) => params?.value || 0,
        },
        {
            field: "coupon_start_date",
            headerName: "START DATE",
            flex: 1,
            renderCell: (params) => (params?.value ? new Date(params.value).toLocaleDateString() : "N/A"),
        },
        {
            field: "coupon_end_date",
            headerName: "END DATE",
            flex: 1,
            renderCell: (params) => (params?.value ? new Date(params.value).toLocaleDateString() : "N/A"),
        },
        {
            field: "status",
            headerName: "STATUS",
            flex: 1,
            renderCell: (params) => (
                <span
                    className={`px-3 py-1.5 rounded-full text-xs font-bold ${params?.value === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                >
                    {params?.value || "Inactive"}
                </span>
            ),
        },
        {
            field: "createdAt",
            headerName: "CREATED AT",
            flex: 1,
            renderCell: (params) => (params?.value ? new Date(params.value).toLocaleDateString() : "N/A"),
        },
    ];

    const visibleColumns = columns.filter((col) => {
        const config = couponHeaders.find((h) => h.key === col.headerName);
        return config ? config.value : true;
    });

    return (
        <div className="min-h-screen bg-gray-50 p-2">
            <div className="max-w-8xl">
                <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
                    <PageHeader
                        title="Coupons"
                        subtitle="View all available coupons"
                    />

                    <div className="p-6 flex flex-wrap items-center gap-4 bg-gray-50 border-b">
                        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Search coupons..." />
                        <ColumnVisibilitySelector
                            headers={couponHeaders}
                            updateTableHeaders={updateTableHeaders}
                            isDropdownOpen={isDropdownOpen}
                            setIsDropdownOpen={setIsDropdownOpen}
                            dropdownRef={dropdownRef}
                        />
                        <DropdownFilter value={activeStatus} onSelect={setActiveStatus} data={COUPON_STATUS_OPTIONS} placeholder="Status" />
                    </div>

                    <div className="p-6 bg-white">
                        <div className="bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden">
                            {loading ? (
                                <div className="text-center py-12 text-gray-500">Loading coupons...</div>
                            ) : error ? (
                                <div className="text-center py-12 text-red-600">Failed to load coupons</div>
                            ) : (
                                <DataTable
                                    rows={coupons?.coupons || coupons?.data || []}
                                    getRowId={(row) => row?._id}
                                    columns={visibleColumns}
                                    page={currentPage}
                                    pageSize={pageSize}
                                    totalCount={coupons?.totalCount || 0}
                                    setCurrentPage={setCurrentPage}
                                    setPageSize={setPageSize}
                                    sort={sort}
                                    setSort={(newSort) => {
                                        const item = newSort[0];
                                        setSort(item ? `${item.field}:${item.sort}` : "");
                                    }}
                                    loading={loading}
                                    noRowsOverlay={
                                        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                                            <p className="text-xl font-medium">No coupons found</p>
                                        </div>
                                    }
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CouponsList;

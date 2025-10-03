import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { formatDateToDDMMYYYY, numberWithCommas, orderStatus } from "../../../utils/helper";
import { useAuth } from "@/context/AuthContext";
import { getSellerOrders } from "@/lib/supabase";
// import { getSellerOrders } from "@/services/orders"; // ⬅️ import your function

const tabs = ["all", "pending", "completed", "shipped", "delivered", "cancelled"];

const Orders = () => {
  const navigate = useNavigate();
  const { userDetails } = useAuth();

  const [loadingOrders, setLoadingOrders] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5; // server-side pagination limit

  // 🔽 Fetch orders from Supabase directly with pagination + filtering
  const fetchOrders = async () => {
    if (!userDetails?.id) return;
    setLoadingOrders(true);

    const result = await getSellerOrders(userDetails.id, {
      page: currentPage,
      limit: itemsPerPage,
      statusFilter: activeTab === "all" ? "" : activeTab,
    });

    if (result) {
      setOrders(result.orders);
      setTotalPages(result.totalPages);
    }

    setLoadingOrders(false);
  };

  // 🔽 Run on page/tab change
  useEffect(() => {
    fetchOrders();
  }, [currentPage, activeTab, userDetails?.id]);

  return (
    <React.Fragment>
      <div className="px-3">
        {/* 🔽 Filter Tabs */}
        <div className="flex gap-3 mb-4 border-b overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1); // reset page when tab changes
              }}
              className={`py-2 px-4 text-sm font-medium capitalize ${
                activeTab === tab ? "border-b-2 border-green-700 text-green-700" : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 🔽 Orders Table */}
        <main className="bg-white px-2 py-5 rounded-md">
          {loadingOrders ? (
            <div className="flex gap-4 items-center justify-center py-4 w-full">
              <ClipLoader color="#086047" size={30} />
              <p>Loading Orders...</p>
            </div>
          ) : orders.length > 0 ? (
            <div className="w-full">
              <div className="relative overflow-x-auto border sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 md:table-fixed">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-5 py-5">Order ID</th>
                      <th scope="col" className="px-10 py-5">Date</th>
                      <th scope="col" className="px-1 py-5">Revenue ($)</th>
                      <th scope="col" className="px-10 py-5">Status</th>
                      <th scope="col" className="px-5 py-5">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr
                        key={order?.id}
                        onClick={() => navigate(`${order.id}`)}
                        className="bg-white border-b hover:bg-gray-50 cursor-pointer"
                      >
                        <td className="px-6 py-4 truncate">{order?.id}</td>
                        <td className="px-6 py-4 truncate">{formatDateToDDMMYYYY(order?.created_at)}</td>
                        <td className="px-6 py-4 truncate">
                          ${numberWithCommas(order?.product?.price * order?.product?.quantity)}
                        </td>
                        <td className={`px-6 py-4 ${orderStatus(order?.status.toLowerCase())}`}>
                          {order?.status}
                        </td>
                        <td className="px-6 py-4">View →</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex justify-center items-center py-10">
              <p className="text-lg text-gray-600">No orders found.</p>
            </div>
          )}

          {/* 🔽 Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </React.Fragment>
  );
};

export default Orders;

import React, { useEffect, useState } from "react";
import { updateOrderStatus } from "../../../api/order"; // Import your API method
import { API_URL } from "../../../api/auth";
import { Transaction, buyerOrder } from "../../../api/transaction";
import moment from 'moment'
import OrderTable from "../common/OrderTableBuyer";
import SearchBar from "../common/SearchBar";

const BuyerOrder: React.FC = () => {
  const [buyerTransaction, setBuyerTransation] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

    // Fetch orders when the component loads
    useEffect(() => {
      const fetchOrders = async () => {
        try {
          const data = await buyerOrder();
          setBuyerTransation(data.reverse());
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        }
      };
  
      fetchOrders();
    }, []);

    const handleUpdateStatus = async (id: number, status: 'SOLD' | 'INACTIVE', transactionId: number) => {
      try {
        // Call API to update order status
        const updatedOrder = await updateOrderStatus(id, status, transactionId);
    
        // Update the local state to reflect the change
        setBuyerTransation((prevOrders) =>
          prevOrders.map((transaction) =>
            transaction.payment.order.id === id
              ? {
                  ...transaction,
                  payment: {
                    ...transaction.payment,
                    order: {
                      ...transaction.payment.order,
                      listing: { ...transaction.payment.order.listing, status: updatedOrder.listing.status },
                    },
                  },
                }
              : transaction
          )
        );
    
        console.log("Order status updated successfully!");
      } catch (error) {
        console.error("Failed to update order status:", error);
      }
    };
    

      // Filter orders based on search query
  const filteredTransaction = buyerTransaction.filter((transaction) => {
    const query = searchQuery.toLowerCase();
    return (
      transaction.payment.order.id.toString().includes(query) ||
      transaction.receiver.email.toLowerCase().includes(query) ||
      transaction.transactionDate.toLowerCase().includes(query) ||
      transaction.payment.order.listing.title?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="max-w-screen-xl bg-white">
      <div className="bg-white py-2 px-3">
        <nav className="flex flex-wrap gap-4">
          <a
            href="#"
            className="inline-flex whitespace-nowrap border-b-2 border-transparent py-2 px-3 text-sm font-medium text-gray-600 transition-all duration-200 ease-in-out hover:border-b-purple-600 hover:text-purple-600"
          >
            Settings
          </a>
          <a
            href="#"
            className="inline-flex whitespace-nowrap border-b-2 border-transparent border-b-purple-600 py-2 px-3 text-sm font-semibold text-purple-600 transition-all duration-200 ease-in-out"
          >
            Orders
          </a>
        </nav>
      </div>

      <div className="w-screen bg-gray-50">
        <div className="mx-auto max-w-screen-xl px-2 py-10">
          <div className="mt-4 w-full">
            <div className="flex w-full flex-col items-center justify-between space-y-2 sm:flex-row sm:space-y-0">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

              <button
                type="button"
                className="relative mr-auto inline-flex cursor-pointer items-center rounded-full border border-gray-200 bg-white px-5 py-2 text-center text-sm font-medium text-gray-800 hover:bg-gray-100 focus:shadow sm:mr-0"
              >
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                <svg
                  className="mr-2 h-3 w-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Filter
              </button>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-xl bg-white px-6 shadow lg:px-4">
            <OrderTable transactions={filteredTransaction} handleUpdateStatus={handleUpdateStatus} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerOrder;

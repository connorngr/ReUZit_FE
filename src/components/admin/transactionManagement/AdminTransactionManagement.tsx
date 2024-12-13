import React, { useEffect, useState, useContext } from "react";
import { updateOrderStatusAdmin } from "../../../api/order";
import { Transaction, fetchAllTransactions, processPendingTransactions, refundFailedTransactions } from "../../../api/transaction";
import TransactionTableAdmin from "../common/TransactionTableAdmin";
import { useSearch } from '../../../context/SearchContext';
import SearchBar from '../../layout/common/SearchBar';
import Swal from "sweetalert2";
import { AuthContext } from "../../../context/AuthContext";

const BuyerOrder: React.FC = () => {
  const [adminTransaction, setAdminTransaction] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRefunding, setIsRefunding] = useState(false); 
  const { query } = useSearch();

  const authContext = useContext(AuthContext);


  // Fetch orders when the component loads
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await fetchAllTransactions();
        setAdminTransaction(data.reverse());
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id: number, status: 'SOLD' | 'INACTIVE' | 'PENDING' | 'ACTIVE', transactionId: number) => {
    try {
      setIsLoading(true);
      // Call API to update order status
      const updatedOrder = await updateOrderStatusAdmin(id, status, transactionId);
      authContext?.triggerUserUpdate();

      // Update the local state to reflect the change
      setAdminTransaction((prevOrders) =>
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
      Swal.fire("Success", "Order status updated successfully!", "success");
    } catch (error) {
      if (error instanceof Error) {
        // Hiển thị thông báo lỗi từ backend
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error.message,
        });
      } else {
        // Hiển thị thông báo lỗi không xác định
        Swal.fire({
          icon: "error",
          title: "Unexpected Error!",
          text: "An unexpected error occurred.",
        });
      }
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // Handle processing pending transactions
  const handleProcessPendingTransactions = async () => {
    setIsProcessing(true); // Show the overlay
    try {
        const message = await processPendingTransactions();
        const data = await fetchAllTransactions();
        setAdminTransaction(data.reverse());
        Swal.fire("Success", message, "success");
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error!",
            text: error instanceof Error ? error.message : "Failed to process pending transactions.",
        });
    } finally {
        setIsProcessing(false); // Hide the overlay
    }
};

const handleRefundFailedTransactions = async () => {
  setIsRefunding(true);
  try {
    const message = await refundFailedTransactions();
    const data = await fetchAllTransactions();
    setAdminTransaction(data.reverse());
    Swal.fire("Success", message, "success");
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: error instanceof Error ? error.message : "Failed to refund failed transactions.",
    });
  } finally {
    setIsRefunding(false);
  }
};


  // Filter orders based on the search query from context
  const filteredTransaction = adminTransaction.filter((transaction) =>
    transaction.payment.order.id.toString().includes(query) ||
    transaction.receiver.email.toLowerCase().includes(query) ||
    transaction.sender.email.toLowerCase().includes(query) ||
    transaction.payment.method.toLowerCase().includes(query) ||
    transaction.transactionDate.toLowerCase().includes(query) ||
    transaction.payment.order.listing.title?.toLowerCase().includes(query)
  );

  return (
    <div className="max-w-screen-xl bg-white">
      <div className="bg-white py-2 px-3">
        <nav className="flex flex-wrap gap-4">
          <a
            href="#"
            className="inline-flex whitespace-nowrap border-b-2 border-transparent border-b-purple-600 py-2 px-3 text-sm font-semibold text-purple-600 transition-all duration-200 ease-in-out"
          >
            Orders
          </a>
          <button
            onClick={handleProcessPendingTransactions}
            className="ml-auto inline-flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md"
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Process Pending Transactions"}
          </button>
          <button
              onClick={handleRefundFailedTransactions}
              className="inline-flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
              disabled={isRefunding}
            >
              {isRefunding ? "Refunding..." : "Refund Failed Transactions"}
            </button>
        </nav>
      </div>

      <div className="w-screen bg-gray-50">
        <div className="mx-auto max-w-screen-xl px-2 py-10">
        {isProcessing && (
            <div className="absolute inset-0 bg-gray-500 opacity-50 z-10"></div>
          )}
          <div className="mt-4 w-full">
            <div className="flex w-full flex-col items-center justify-between space-y-2 sm:flex-row sm:space-y-0">
              <SearchBar />
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-xl bg-white px-6 shadow lg:px-4">
            <TransactionTableAdmin transactions={filteredTransaction} handleUpdateStatus={handleUpdateStatus} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerOrder;

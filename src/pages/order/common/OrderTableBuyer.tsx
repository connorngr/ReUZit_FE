import React from "react";
import moment from "moment";
import { API_URL } from "../../../api/auth";
import { Transaction
    
 } from "../../../api/transaction";
interface OrderTableProps {
  transactions: Transaction[];
  handleUpdateStatus: (id: number, status: 'SOLD' | 'INACTIVE', transactionId: number) => void;
  isLoading: boolean; // New prop to handle loading state
}

const OrderTableBuyer: React.FC<OrderTableProps> = ({ transactions, handleUpdateStatus, isLoading }) => {
  return (
    <table className="min-w-full border-collapse border-spacing-y-2 border-spacing-x-2">
      <thead className="hidden border-b lg:table-header-group">
        <tr>
          <td className="py-4 text-sm font-semibold text-gray-800 sm:px-3">Order Date</td>
          <td className="py-4 text-sm font-medium text-gray-500 sm:px-3">Order ID</td>
          <td className="py-4 text-sm font-medium text-gray-500 sm:px-3">Description</td>
          <td className="py-4 text-sm font-medium text-gray-500 sm:px-3">Shop</td>
          <td className="py-4 text-sm font-medium text-gray-500 sm:px-3">Customer</td>
          <td className="py-4 text-sm font-medium text-gray-500 sm:px-3">Category</td>
          <td className="py-4 text-sm font-medium text-gray-500 sm:px-3">Price</td>
          <td className="py-4 text-sm font-medium text-gray-500 sm:px-3">Status</td>
        </tr>
      </thead>
      <tbody className="bg-white lg:border-gray-300">
        {transactions.map((transaction) => (
          <tr key={transaction.id}>
            <td className="py-4 text-sm text-gray-600 sm:px-3">
              {moment(transaction.transactionDate.toString()).format("DD/MM/YYYY")}
            </td>
            <td className="py-4 text-sm text-gray-600 sm:px-3">{transaction.payment.order.id}</td>
            <td className="py-4 text-sm text-gray-600 sm:px-3">{transaction.payment.order.listing.title}</td>
            <td className="py-4 sm:px-3">
              <img
                className="h-8 w-8 overflow-hidden rounded-full border p-1"
                src={`${API_URL}${transaction.sender.imageUrl}`}
                alt=""
              />
            </td>
            <td className="py-4 text-sm text-gray-600 sm:px-3">{transaction.sender.lastName}</td>
            <td className="py-4 text-sm text-gray-600 sm:px-3">{transaction.payment.order.listing.category.name}</td>
            <td className="py-4 text-sm text-gray-600 sm:px-3">
              {Number(transaction.payment.order.listing.price).toLocaleString("vi-VN")} VND
            </td>
            <td className="py-4 px-4">
            {isLoading ? (
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-lg flex items-center justify-center text-white text-sm tracking-wider font-semibold border-none outline-none bg-blue-600 hover:bg-blue-700 active:bg-blue-600"
                  disabled
                >
                  Loading
                  <svg xmlns="http://www.w3.org/2000/svg" width="18px" fill="#fff" className="ml-2 inline animate-spin" viewBox="0 0 24 24">
                    <path
                      d="M12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8V2C6.579 2 2 6.58 2 12c0 5.421 4.579 10 10 10z"
                    />
                  </svg>
                </button>
              ) : (
                <select
                className={`ml-2 mr-3 whitespace-nowrap rounded-full px-2 py-0.5 appearance-none ${
                  transaction.payment.order.listing.status === "SOLD"
                    ? "bg-green-100 text-green-800"
                    : transaction.payment.order.listing.status === "PENDING"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-red-100 text-red-800"
                }`}
                value={transaction.payment.order.listing.status}
                onChange={(e) => {
                  const selectedStatus = e.target.value as 'SOLD' | 'INACTIVE';
              
                  // Confirmation dialog before updating status
                  const confirmMessage =
                    selectedStatus === "SOLD"
                      ? "Are you sure you want to mark this order as SOLD?"
                      : "Are you sure you want to cancel this order?";
              
                  if (window.confirm(confirmMessage)) {
                    handleUpdateStatus(
                      transaction.payment.order.id,
                      selectedStatus,
                      transaction.id
                    );
                  }
                }}
                disabled={transaction.payment.order.listing.status !== "PENDING"}
              >
                <option value="PENDING" disabled>
                  Chờ xác nhận
                </option>
                <option value="SOLD">Thanh toán</option>
                <option value="INACTIVE">Hủy đơn</option>
              </select>              
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrderTableBuyer;

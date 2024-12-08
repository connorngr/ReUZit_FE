import React from "react";
import moment from "moment";
import { API_URL } from "../../../api/auth";
import { Transaction
    
 } from "../../../api/transaction";
interface OrderTableProps {
  transactions: Transaction[];
  handleUpdateStatus: (id: number, status: 'SOLD' | 'INACTIVE', transactionId: number) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({ transactions, handleUpdateStatus }) => {
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
              <select
                className={`ml-2 mr-3 whitespace-nowrap rounded-full px-2 py-0.5 appearance-none ${
                  transaction.payment.order.listing.status === "SOLD"
                    ? "bg-green-100 text-green-800"
                    : transaction.payment.order.listing.status === "PENDING"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-red-100 text-red-800"
                }`}
                value={transaction.payment.order.listing.status}
                onChange={(e) =>
                  handleUpdateStatus(
                    transaction.payment.order.id,
                    e.target.value as 'SOLD' | 'INACTIVE',
                    transaction.id
                  )
                }
                disabled={transaction.payment.order.listing.status !== "PENDING"}
              >
                <option value="PENDING" disabled>
                  Chờ xác nhận
                </option>
                <option value="SOLD">Thanh toán</option>
                <option value="INACTIVE">Hủy đơn</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrderTable;

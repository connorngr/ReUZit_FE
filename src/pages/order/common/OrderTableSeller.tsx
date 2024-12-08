import React from "react";
import moment from "moment";
import { Transaction } from "../../../api/transaction";
import { API_URL } from "../../../api/auth";

interface OrderTableProps {
  transactions: Transaction[];
  onAddressClick: (address: any) => void;
}

const statusLabels: { [key: string]: string } = {
  PENDING: "Chờ phản hồi",
  SOLD: "Đã thanh toán",
  INACTIVE: "Bị từ chối",
};

const OrderTableSeller: React.FC<OrderTableProps> = ({ transactions, onAddressClick }) => {
  return (
    <div className="mt-6 overflow-hidden rounded-xl bg-white px-6 shadow lg:px-4">
      <table className="min-w-full border-collapse border-spacing-y-2 border-spacing-x-2">
        <thead className="hidden border-b lg:table-header-group">
          <tr>
            <td className="py-4 text-sm font-semibold text-gray-800 sm:px-3">Order Date</td>
            <td className="py-4 text-sm font-medium text-gray-500 sm:px-3">Order ID</td>
            <td className="py-4 text-sm font-medium text-gray-500 sm:px-3">Description</td>
            <td className="py-4 text-sm font-medium text-gray-500 sm:px-3">Avatar</td>
            <td className="py-4 text-sm font-medium text-gray-500 sm:px-3">Customer</td>
            <td className="py-4 text-sm font-medium text-gray-500 sm:px-3">Price</td>
            <td className="py-4 text-sm font-medium text-gray-500 sm:px-3">Address</td>
            <td className="py-4 text-sm font-medium text-gray-500 sm:px-3">Status</td>
          </tr>
        </thead>
        <tbody className="bg-white lg:border-gray-300">
          {transactions.map((transaction) => (
            <tr key={transaction.payment.order.id}>
              <td className="py-4 text-sm text-gray-600 sm:px-3">
                {moment(transaction.transactionDate.toString()).format("DD/MM/YYYY")}
                </td>
              <td className="py-4 text-sm text-gray-600 sm:px-3">{transaction.payment.order.id}</td>
              <td className="py-4 text-sm text-gray-600 sm:px-3">{transaction.payment.order.listing.title}</td>
              <td className="py-4 sm:px-3">
              <img
                className="h-8 w-8 overflow-hidden rounded-full border p-1"
                  src={`${API_URL}${transaction.receiver.imageUrl}`}
                  alt=""
                />
              </td>
              <td className="py-4 text-sm text-gray-600 sm:px-3">{transaction.receiver.lastName}</td>
              <td className="py-4 text-sm text-gray-600 sm:px-3">
                {Number(transaction.payment.order.listing.price).toLocaleString("vi-VN")} VND
              </td>
              <td>
                <button onClick={() => onAddressClick(transaction.payment.order.shippingAddress)}>
                  {transaction.payment.order.shippingAddress.province}
                </button>
              </td>
              <td className="py-4 px-4" >
                <div className={`ml-2 mr-3 whitespace-nowrap rounded-full px-2 py-0.5 appearance-none ${
                  transaction.payment.order.listing.status === "SOLD"
                    ? "bg-green-100 text-green-800"
                    : transaction.payment.order.listing.status === "PENDING"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-red-100 text-red-800"
                }`}>
                {statusLabels[transaction.payment.order.listing.status] || "Không xác định"}
                </div>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTableSeller;

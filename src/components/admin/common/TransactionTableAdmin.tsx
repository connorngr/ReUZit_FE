import React from "react";
import moment from "moment";
import { Transaction } from "../../../api/transaction";

interface TransactionTableAdmin {
  transactions: Transaction[];
  handleUpdateStatus: (id: number, status: 'SOLD' | 'INACTIVE' | 'PENDING' | 'ACTIVE', transactionId: number) => void;
  isLoading: boolean;
}

const TransactionTableAdmin: React.FC<TransactionTableAdmin> = ({ transactions, handleUpdateStatus, isLoading }) => {
  return (
    <table className="min-w-full border-collapse border-spacing-y-2 border-spacing-x-2">
      <thead className="hidden border-b lg:table-header-group">
        <tr>
          <td className="py-4 text-sm font-semibold text-gray-800 sm:px-3">Date</td>
          <td className="py-4 text-sm font-medium text-gray-500 sm:px-3">Type</td>
          <td className="py-4 text-sm font-medium text-gray-500 sm:px-3">Code order</td>
          <td className="py-4 text-sm font-medium text-gray-500 sm:px-3">Method payment</td>
          <td className="py-4 text-sm font-medium text-gray-500 sm:px-3">Confirmation date</td>
          <td className="py-4 text-sm font-medium text-gray-500 sm:px-3">Sender</td>
          <td className="py-4 text-sm font-medium text-gray-500 sm:px-3">Receiver</td>
          <td className="py-4 text-sm font-medium text-gray-500 sm:px-3">Price</td>
          <td className="py-4 text-sm font-medium text-gray-500 sm:px-3">Status</td>
        </tr>
      </thead>
      <tbody className="bg-white lg:border-gray-300">
        {transactions.map((transaction) => {
          const status = transaction.payment.order.listing.status;
          
          // Check if the status is "SOLD" or "INACTIVE" and show the secondary select
          const showSecondarySelect = status === "INACTIVE";

          return (
            <tr key={transaction.id}>
              <td className="py-4 text-sm text-gray-600 sm:px-3">
                {moment(transaction.transactionDate.toString()).format("DD/MM/YYYY")}
              </td>
              <td className="py-4 text-sm text-gray-600 sm:px-3">{transaction.transactionType}</td>
              <td className="py-4 text-sm text-gray-600 sm:px-3">{transaction.payment.order.id}</td>
              <td className="py-4 text-sm text-gray-600 sm:px-3">{transaction.payment.method}</td>
              <td className="py-4 text-sm text-gray-600 sm:px-3">
                {moment(transaction.payment.order.confirmationDate.toString()).format("DD/MM/YYYY")}
              </td>
              <td className="py-4 text-sm text-gray-600 sm:px-3">
                <p>{transaction.sender.email}</p>
              </td>
              <td className="py-4 text-sm text-gray-600 sm:px-3">
                <p>{transaction.receiver.email}</p>
              </td>
              <td className="py-4 text-sm text-gray-600 sm:px-3">
                {Number(transaction.payment.amount).toLocaleString("vi-VN")} VND
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
                      <path d="M12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8V2C6.579 2 2 6.58 2 12c0 5.421 4.579 10 10 10z" />
                    </svg>
                  </button>
                ) : (
                  // If status is SOLD or INACTIVE, show a secondary select with only PENDING option
                  !showSecondarySelect ? (
                    <select
                      className={`ml-2 mr-3 whitespace-nowrap rounded-full px-2 py-0.5 appearance-none ${
                        status === "SOLD"
                          ? "bg-green-100 text-green-800"
                          : status === "PENDING"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                      value={status}
                      onChange={(e) =>
                        handleUpdateStatus(
                          transaction.payment.order.id,
                          e.target.value as 'SOLD' | 'INACTIVE' | 'PENDING',
                          transaction.id
                        )
                      }
                      disabled={status === "SOLD" || status === "INACTIVE"}
                    >
                      <option value="PENDING" disabled>
                        Chờ xác nhận
                      </option>
                      <option value="SOLD">Thanh toán</option>
                      <option value="INACTIVE">Hủy đơn</option>
                    </select>
                  ) : (
                    // Show a new select for SOLD or INACTIVE with only the PENDING option
                    <select
                      className={`ml-2 mr-3 whitespace-nowrap rounded-full px-2 py-0.5 appearance-none ${
                        "bg-red-100 text-red-800"
                      }`}
                      value={status}
                      onChange={(e) =>
                        handleUpdateStatus(
                          transaction.payment.order.id,
                          e.target.value as 'SOLD' | 'INACTIVE' | 'PENDING',
                          transaction.id
                        )
                      }
                    >
                      <option value="PENDING">
                        Chờ xác nhận
                      </option>
                      <option value="INACTIVE" disabled>Hủy đơn</option>
                    </select>
                  )
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TransactionTableAdmin;

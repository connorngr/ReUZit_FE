import React from "react";
import moment from "moment";
import { API_URL } from "../../../api/auth";
import { Transaction
    
 } from "../../../api/transaction";
interface DespositTableAdmin {
  transactions: Transaction[];
}

const DespositTableAdmin: React.FC<DespositTableAdmin> = ({ transactions }) => {
  return (
    <table className="min-w-full border-collapse border-spacing-y-2 border-spacing-x-2">
      <thead className="hidden border-b lg:table-header-group">
        <tr>
          <td className="py-4 text-sm font-semibold text-gray-800 sm:px-3">TransactionId </td>
          <td className="py-4 text-sm font-medium text-gray-500 sm:px-3">Date</td>
          <td className="py-4 text-sm font-medium text-gray-500 sm:px-3">Type payment</td>
          <td className="py-4 text-sm font-medium text-gray-500 sm:px-3">Amount</td>
        </tr>
      </thead>
      <tbody className="bg-white lg:border-gray-300">
        {transactions.map((transaction) => (
          <tr key={transaction.id}>
            <td className="py-4 text-sm text-gray-600 sm:px-3">{transaction.payment.transactionId}</td>
            <td className="py-4 text-sm text-gray-600 sm:px-3">
              {moment(transaction.transactionDate.toString()).format("DD/MM/YYYY")}
            </td>
            <td className="py-4 text-sm text-gray-600 sm:px-3">{transaction.payment.method}</td>
            <td className="py-4 text-sm text-gray-600 sm:px-3">
              {Number(transaction.payment.amount).toLocaleString("vi-VN")} VND
            </td>
            
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DespositTableAdmin;

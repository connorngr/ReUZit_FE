import React, { useEffect, useState } from "react";
import { updateOrderStatus } from "../../../api/order"; // Import your API method
import { API_URL } from "../../../api/auth";
import { Transaction, buyerOrder } from "../../../api/transaction";
import moment from 'moment'

const BuyerOrder: React.FC = () => {
  const [buyerTransaction, setBuyerTransation] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

    // Fetch orders when the component loads
    useEffect(() => {
      const fetchOrders = async () => {
        try {
          const data = await buyerOrder();
          setBuyerTransation(data);
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        }
      };
  
      fetchOrders();
    }, []);

    const handleUpdateStatus = async (id: number, status: 'SOLD' | 'INACTIVE', transactionId: number) => {
      try {
        const updatedOrder = await updateOrderStatus(id, status, transactionId);
        setBuyerTransation((prevOrders) =>
          prevOrders.map((order) =>
            order.payment.order.id === id
              ? { ...order, payment: { ...order.payment, order: { ...order.payment.order, status: updatedOrder.listing.status } } }
              : order
          )
        );
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
              <form className="relative flex w-full max-w-2xl items-center">
                <svg
                  className="absolute left-2 block h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  name="search"
                  className="h-12 w-full border-b-gray-400 bg-transparent py-4 pl-12 text-sm outline-none focus:border-b-2"
                  placeholder="Search by Order ID, Date, Customer"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>

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
            <table className="min-w-full border-collapse border-spacing-y-2 border-spacing-x-2">
              <thead className="hidden border-b lg:table-header-group">
              
                <tr>
                  <td className="whitespace-normal py-4 text-sm font-semibold text-gray-800 sm:px-3">
                    Order Date
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="float-right mt-1 h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </td>
                  <td className="whitespace-normal py-4 text-sm font-medium text-gray-500 sm:px-3">
                    Order ID
                  </td>
                  <td className="whitespace-normal py-4 text-sm font-medium text-gray-500 sm:px-3">
                    Description
                  </td>
                  <td className="whitespace-normal py-4 text-sm font-medium text-gray-500 sm:px-3">
                    Shop
                  </td>
                  <td className="whitespace-normal py-4 text-sm font-medium text-gray-500 sm:px-3">
                    Customer
                  </td>
                  <td className="whitespace-normal py-4 text-sm font-medium text-gray-500 sm:px-3">
                    Category
                  </td>
                  {/* <td className="whitespace-normal py-4 text-sm font-medium text-gray-500 sm:px-3">
                    Null
                  </td> */}
                  <td className="whitespace-normal py-4 text-sm font-medium text-gray-500 sm:px-3">
                    Price
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="float-right mt-1 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                      />
                    </svg>
                  </td>
                  <td className="whitespace-normal py-4 text-sm font-medium text-gray-500 sm:px-3">
                    Status
                  </td>
                </tr>
              </thead>

              <tbody className="bg-white lg:border-gray-300">
              {filteredTransaction.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="whitespace-no-wrap py-4 text-left text-sm text-gray-600 sm:px-3 lg:text-left">
                  {moment(transaction.transactionDate.toString()).format('DD/MM/YYYY')}
                  </td>
                  <td className="whitespace-no-wrap hidden py-4 text-sm font-normal text-gray-600 sm:px-3 lg:table-cell">
                  {transaction.payment.order.id}
                  </td>

                  <td className="whitespace-no-wrap hidden py-4 text-sm font-normal text-gray-600 sm:px-3 lg:table-cell">
                  {transaction.payment.order.listing.title}
                  </td>

                  <td className="whitespace-no-wrap hidden py-4 text-sm font-normal text-gray-600 sm:px-3 lg:table-cell">
                    <img
                      className="h-8 w-8 overflow-hidden rounded-full border p-1"
                      src={`${API_URL}${transaction.sender.imageUrl}`}
                      alt=""
                    />
                  </td>

                  <td className="whitespace-no-wrap hidden py-4 text-left text-sm text-gray-600 sm:px-3 lg:table-cell lg:text-left">
                    {transaction.sender.lastName}
                  </td>

                  <td className="whitespace-no-wrap hidden py-4 text-left text-sm text-gray-600 sm:px-3 lg:table-cell lg:text-left">
                    {transaction.payment.order.listing.category.name}
                  </td>
                  <td className="whitespace-no-wrap py-4 text-right text-sm text-gray-600 sm:px-3 lg:text-left">
                    
                    {Number(transaction.payment.order.listing.price).toLocaleString('vi-VN')} VND
                  </td>
                  <td className="py-4 px-4">
                      <select
                        className={`ml-2 mr-3 whitespace-nowrap rounded-full px-2 py-0.5 appearance-none ${transaction.payment.order.listing.status === "SOLD"
                            ? "bg-green-100 text-green-800"
                            : transaction.payment.order.listing.status === "PENDING"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        value={transaction.payment.order.listing.status}
                        onChange={(e) =>
                          handleUpdateStatus(transaction.payment.order.id, e.target.value as 'SOLD' | 'INACTIVE',transaction.id)
                        }
                        disabled={transaction.payment.order.listing.status !== "PENDING"}
                      >
                        <option value="PENDING" disabled>PENDING</option>
                        <option value="SOLD">SOLD</option>
                        <option value="INACTIVE">INACTIVE</option>
                      </select>
                    </td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerOrder;

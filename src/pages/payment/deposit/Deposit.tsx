import React, { useState } from "react";
import Swal from "sweetalert2";
import { getDeposit } from "../../../api/payment"; // Import hàm getDeposit từ file API của bạn
import { useNavigate } from "react-router-dom";

const Deposit: React.FC = () => {
  const [amount, setAmount] = useState<number | "">("");
  const navigate = useNavigate(); // Hook để chuyển trang

  const handleDeposit = async () => {
    if (!amount || amount <= 0) {
      Swal.fire("Invalid Input", "Please enter a valid amount to deposit.", "warning");
      return;
    }

    try {
      const paymentDeposit = await getDeposit(amount);
      window.location.href = paymentDeposit; // Chuyển hướng tới URL thanh toán
    } catch (error: any) {
      Swal.fire("Payment Error", error?.message || "An unknown error occurred.", "error");
    } finally {
      // Dù thành công hay thất bại, chuyển hướng về trang "./"
      navigate("./");
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-md max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4">Deposit Money</h2>
      <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
        Enter Amount to Deposit
      </label>
      <input
        type="number"
        id="amount"
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder="Enter amount"
      />
      <button
        onClick={handleDeposit}
        className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
      >
        Deposit
      </button>
    </div>
  );
};

export default Deposit;
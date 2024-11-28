import React from 'react';

interface PaymentMethodProps {
  paymentMethod: string;
  onChangePaymentMethod: (method: string) => void;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({ paymentMethod, onChangePaymentMethod }) => (
  <div className="grid md:grid-cols-3 gap-4 mt-12">
    <div>
      <h3 className="text-3xl font-bold text-gray-300">03</h3>
      <h3 className="text-xl font-bold text-gray-800 mt-1">Payment Method</h3>
    </div>
    <div className="md:col-span-2">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center">
          <input
            type="radio"
            className="w-5 h-5 cursor-pointer"
            id="vnpay"
            value="vnpay"
            checked={paymentMethod === 'vnpay'}
            onChange={() => onChangePaymentMethod('vnpay')}
          />
          <label htmlFor="vnpay" className="ml-4 flex gap-2 cursor-pointer items-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Vnpay_logo.svg" className="w-24" alt="VNPay" />
            <span className="text-gray-800 font-medium">VNPay</span>
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="radio"
            className="w-5 h-5 cursor-pointer"
            id="cod"
            value="cod"
            checked={paymentMethod === 'cod'}
            onChange={() => onChangePaymentMethod('cod')}
          />
          <label htmlFor="cod" className="ml-4 flex gap-2 cursor-pointer items-center">
            <img src="https://img.icons8.com/ios-filled/50/000000/cash-on-delivery.png" className="w-12" alt="COD" />
            <span className="text-gray-800 font-medium">Cash on Delivery (COD)</span>
          </label>
        </div>
      </div>
    </div>
  </div>
);

export default PaymentMethod;

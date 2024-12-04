import React from 'react';
import {Listing} from '../../../api/listing';
// Định nghĩa interface cho props
interface PaymentSummaryProps {
    paymentMethod: string;
    setPaymentMethod: (method: string) => void;
    listing: Listing;
    handleSubmit: (e: React.FormEvent) => Promise<void>; // Điều chỉnh kiểu tại đây
    navigate: (path: string) => void;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  paymentMethod,
  setPaymentMethod,
  listing,
  handleSubmit,
  navigate,
}) => {
  return (
    <div>
      {/* Payment Method */}
      <div className="grid md:grid-cols-3 gap-4 mt-12">
        <div>
          <h3 className="text-3xl font-bold text-gray-300">02</h3>
          <h3 className="text-xl font-bold text-gray-800 mt-1">Payment Method</h3>
        </div>

        <div className="md:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* VNPay */}
            <div className="flex items-center">
              <input
                type="radio"
                className="w-5 h-5 cursor-pointer"
                id="vnpay"
                value="vnpay"
                checked={paymentMethod === 'vnpay'}
                onChange={() => setPaymentMethod('vnpay')}
              />
              <label htmlFor="vnpay" className="ml-4 flex gap-2 cursor-pointer items-center">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgPySHNqHI04HyzOv_VyHqX2AdQRqTJCR2uw&s"
                  className="w-24"
                  alt="VNPay"
                />
                <span className="text-gray-800 font-medium">VNPay</span>
              </label>
            </div>

            {/* COD */}
            <div className="flex items-center">
              <input
                type="radio"
                className="w-5 h-5 cursor-pointer"
                id="cod"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
              />
              <label htmlFor="cod" className="ml-4 flex gap-2 cursor-pointer items-center">
                <img
                  src="https://img.icons8.com/ios-filled/50/000000/cash-on-delivery.png"
                  className="w-12"
                  alt="COD"
                />
                <span className="text-gray-800 font-medium">Cash on Delivery (COD)</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-md max-lg:-order-1 mt-10 mb-10">
        <h3 className="text-lg font-bold text-gray-800">Summary</h3>
        <ul className="text-gray-800 mt-6 space-y-3">
          <li className="flex flex-wrap gap-4 text-sm">Sub total <span className="ml-auto font-bold">{Number(listing.price).toLocaleString('vi-VN')} VND</span></li>
          <li className="flex flex-wrap gap-4 text-sm">Discount (20%) <span className="ml-auto font-bold">0 VND</span></li>
          <li className="flex flex-wrap gap-4 text-sm">Tax <span className="ml-auto font-bold">0 VND</span></li>
          <hr />
          <li className="flex flex-wrap gap-4 text-base font-bold">Total <span className="ml-auto">{Number(listing.price).toLocaleString('vi-VN')} VND</span></li>
        </ul>
      </div>

      {/* Submit Buttons */}
      <div className="flex flex-wrap justify-end gap-4 mt-12 mb-20">
        <button
          type="button"
          className="px-6 py-3 text-sm font-semibold tracking-wide bg-transparent border-2 text-gray-800 rounded-md hover:bg-gray-100"
          onClick={() => { navigate('/') }}
        >
          Pay later
        </button>
        <button
          type="button"
          className="px-6 py-3 text-sm font-semibold tracking-wide bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Pay now
        </button>
      </div>
    </div>
  );
};

export default PaymentSummary;
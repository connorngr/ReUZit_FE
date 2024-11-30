import React, { useEffect, useState } from 'react';

const PaymentFailed: React.FC = () => {
    return (
        <div className="bg-red-200 border-green-600 text-green-600 border-l-4 p-4" role="alert">
            <p className="font-bold">
                Failed
            </p>
            <p>
                Transaction of you failed
            </p>
        </div>
    )
}

export default PaymentFailed;
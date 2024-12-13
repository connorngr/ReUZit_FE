import React, { useEffect, useState } from "react";
import { Transaction, fetchDepositTransactions } from "../../../api/transaction";
import { useSearch } from '../../../context/SearchContext';
import SearchBar from '../../../components/layout/common/SearchBar';
import DespositTableAdmin from '../common/DespositTableAdmin';

const DespositManagement: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const { query } = useSearch();

    // Fetch orders when the component loads
    useEffect(() => {
        const loadDepositTransactions = async () => {
            try {
                const transactions = await fetchDepositTransactions();
                setTransactions(transactions);
                console.log("Deposit Transactions:", transactions);
            } catch (error) {
                console.error("Error fetching deposit transactions:");
            }
        };
        
        loadDepositTransactions();
    }, []);
    // Filter orders based on the search query from context
    const filteredTransaction = transactions.filter((transaction) =>
        transaction.id.toString().includes(query) ||
        transaction.transactionType.toLowerCase().includes(query) ||
        transaction.transactionDate.toLowerCase().includes(query) ||
        transaction.payment.amount.toString().toLowerCase().includes(query)
    );

    return (
        <div className="max-w-screen-xl bg-white">
            <div className="bg-white py-2 px-3">
                <nav className="flex flex-wrap gap-4">
                    <a
                        href="#"
                        className="inline-flex whitespace-nowrap border-b-2 border-transparent border-b-purple-600 py-2 px-3 text-sm font-semibold text-purple-600 transition-all duration-200 ease-in-out"
                    >
                        Orders Managerment
                    </a>
                </nav>
            </div>
            <div className="w-screen bg-gray-50">
                <div className="mx-auto max-w-screen-xl px-2 py-10">
                    <div className="mt-4 w-full">
                        <div className="flex w-full flex-col items-center justify-between space-y-2 sm:flex-row sm:space-y-0">
                            <SearchBar />
                        </div>
                    </div>
                    <DespositTableAdmin
                        transactions={filteredTransaction}
                    />

                </div>
            </div>
        </div>
    );
};

export default DespositManagement;

import { useState, useRef } from "react";
import { useSearch } from '../../../context/SearchContext';

const CategoryDropdown = ({
    categories,
    setCategoryId,
}: {
    categories: { id: number; name: string }[];
    setCategoryId: (id: number) => void;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)} // Off dropdown
            ref={dropdownRef}

        >
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="border-transparent text-neutral-500 inline-flex items-center border-b-2 pt-px text-sm font-medium hover:text-neutral-700"
            >
                Category
            </button>

            {isOpen && (
                <ul className="absolute top-full left-0 bg-white border rounded shadow-lg z-10">
                    {categories.length > 0 ? (
                        categories.map((category) => (
                            <li key={category.id}>
                                <button
                                    onClick={() => {
                                        setCategoryId(category.id); // Set the selected category ID
                                        setIsOpen(false); // Close the dropdown
                                    }}
                                    className="block px-4 py-2 text-sm text-neutral-700 hover:bg-gray-100 w-full text-left"
                                >
                                    {category.name}
                                </button>
                            </li>
                        ))
                    ) : (
                        <li className="px-4 py-2 text-sm text-neutral-700">Không có danh mục nào</li>
                    )}
                </ul>
            )}

        </div>
    );
};

export default CategoryDropdown;

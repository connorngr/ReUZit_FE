import React, { useState, useEffect } from 'react';
import { useSearch } from '../../../context/SearchContext'; // Import the useSearch hook
import { fetchCategories, Category } from "../../../api/category";
import { useNavigate } from 'react-router-dom';


const NavbarLinks = () => {
  const { query,setCategoryId, setQuery } = useSearch(); // Get query and setQuery from context
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
        setFilteredCategories(fetchedCategories); // Initially show all categories
      } catch (err) {
        console.error("Error loading categories", err);
      }
    };

    loadCategories();
  }, []);

  // Filter categories based on the search query
  useEffect(() => {
    const filtered = categories.filter((category) =>
      category.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [query, categories]);

  return (
    <ul className="hidden gap-4 overflow-x-auto whitespace-nowrap md:flex lg:gap-8 lg:px-0">
      <li
        key="all"
        className="relative inline-flex"
        onMouseEnter={() => setShowDropdown(true)}
        onMouseLeave={() => setShowDropdown(false)}
      >
        <button
          className="border-transparent text-neutral-500 inline-flex items-center border-b-2 pt-px text-sm font-medium hover:text-neutral-700"
        >
          Danh Mục
        </button>
        {showDropdown && (
          <ul className="absolute top-full left-0 mt-2 bg-white border rounded shadow-lg z-10">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <li key={category.id}>
                  <a
                    href={`/default-channel/categories/${category.name.toLowerCase()}`}
                    className="block px-4 py-2 text-sm text-neutral-700 hover:bg-gray-100"
                  >
                    {category.name}
                  </a>
                </li>
              ))
            ) : (
              <li>Không có danh mục nào</li> // Display when no categories match
            )}
          </ul>
        )}
      </li>
      {categories.slice(0, 2).map((category) => (
        <li key={category.id} className="inline-flex">
          <button
            className="border-transparent text-neutral-500 inline-flex items-center border-b-2 pt-px text-sm font-medium hover:text-neutral-700"
            onClick={() => {
              setCategoryId(category.id); // Set the selected category ID
              navigate('/'); // Redirect to /home
            }}
          >
            {category.name}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default NavbarLinks;

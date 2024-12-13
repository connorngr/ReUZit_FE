import { useState, useEffect } from 'react';
import { useSearch } from '../../../context/SearchContext'; // Import the useSearch hook
import { fetchCategories, Category } from "../../../api/category";
import { useNavigate } from 'react-router-dom';
import CategoryDropdown from './CategoryDropdown';

const NavbarLinks = () => {
  const { setCategoryId } = useSearch(); // Get query and setQuery from context
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
      } catch (err) {
        console.error("Error loading categories", err);
      }
    };

    loadCategories();
  }, []);

  return (

    <>
      <CategoryDropdown
        categories={categories}
        setCategoryId={(id) => {
          setCategoryId(id); // Update selected category ID
          navigate("/"); // Redirect to /
        }}
      />
      {/* <ul className="hidden gap-4 overflow-x-auto whitespace-nowrap md:flex lg:gap-8 lg:px-0">
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

      </ul> */}
    </>

  );
};

export default NavbarLinks;
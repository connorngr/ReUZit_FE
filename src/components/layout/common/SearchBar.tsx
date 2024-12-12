import React from 'react';
import { useSearch } from '../../../context/SearchContext'; // Import the useSearch hook

const SearchBar: React.FC = () => {
  const { query, setQuery } = useSearch(); // Access query and setQuery from context

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value); // Update query on user input
  };
  return (
    <form className="group relative my-2 flex w-full items-center justify-items-center text-sm lg:w-80">
      <label className="w-full">
        <input
        type="text"
        value={query}
        onChange={handleSearchChange}
          placeholder="Search for products..."
          className="h-10 w-full rounded-md border border-neutral-300 bg-transparent bg-white px-4 py-2 pr-10 text-sm text-black placeholder:text-neutral-500 focus:border-black focus:ring-black"
          
          name="search"
        />
      </label>
      <div className="absolute inset-y-0 right-0">
        <button
          type="submit"
          className="inline-flex aspect-square w-10 items-center justify-center text-neutral-500 hover:text-neutral-700 focus:text-neutral-700"
        >
          <span className="sr-only">search</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-search h-5 w-5"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
        </button>
      </div>
    </form>
  );
};
  
  export default SearchBar;
  
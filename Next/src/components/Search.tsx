"use client";
import { useEffect, useState } from "react";
import { performSearch } from "../../sanity/sanity-utils";
import { listItem } from "../../types/listItem-type";
import ListItem from "./ListItem";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<listItem[]>([]);
  const [searchClick, setSearchClick] = useState(false);

  useEffect(() => {
    setSearchClick(false);
  }, [searchTerm]);

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let newSearchResults = await performSearch(searchTerm);

    setSearchResults(newSearchResults);

    setSearchClick(true);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="w-[100%] sm:w-[60%]">
      <form onSubmit={handleSearch}>
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <input
            name="search"
            type="search"
            id="default-search"
            className="block w-full p-4 pl-10 text-base text-gray-900 border rounded bg-gray-50 focus:ring-blue-500 focus:outline-none shadow focus:shadow-wprdShadow transition"
            placeholder="Search questions"
            value={searchTerm}
            onChange={handleInputChange}
            required
          />
          <button
            type="submit"
            className="hidden md:block text-white absolute right-2.5 top-1/2 bg-tl-light-blue focus:bg-tl-light-blue font-medium rounded text-base px-4 py-2 transform -translate-y-1/2"
          >
            Search
          </button>
        </div>
        <button
          type="submit"
          className="text-white md:hidden bg-tl-light-blue focus:bg-tl-light-blue font-medium rounded text-base px-4 py-2 mt-5"
        >
          Search
        </button>
      </form>
      <div>
        {searchClick && searchResults.length > 0 ? (
          <div>
            <h2 className="my-10">
              Search results for: &#34;{searchTerm}&#34;
            </h2>

            {searchResults.map((item, index) => (
              <ListItem
                key={index}
                image={item.image}
                title={item.title}
                slug={item.slug}
                badge={item.badge}
                interviewSlug={item.interviewSlug}
              />
            ))}
          </div>
        ) : searchClick && searchTerm.length > 0 ? (
          <h2 className="my-10">
            No search results for: &#34;{searchTerm}&#34;
          </h2>
        ) : null}
      </div>
    </div>
  );
};

export default Search;

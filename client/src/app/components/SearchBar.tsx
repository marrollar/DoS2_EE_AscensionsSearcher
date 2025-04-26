"use client"

import { useQueryState } from "nuqs";
import { useDebouncedCallback } from "use-debounce";

export default function SearchBar() {
    const [searchQuery, setSearchQuery] = useQueryState("query", { defaultValue: "" })

    const handleSearchChange = useDebouncedCallback((e) => {
        const searchStr = e.target.value
        setSearchQuery(searchStr)
    }, 300)

    return (
        <div className="flex">
            <input
                id={"MainKeyWordSearchBar"}
                type="text"
                onChange={handleSearchChange}
                className="input flex-1 mx-4 my-4"
                placeholder="Keyword search..."
                defaultValue={searchQuery}
            />
        </div>

    )
    // mx-4 my-4 px-2 py-2 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
    // input w-full border border-gray-300 my-2
}

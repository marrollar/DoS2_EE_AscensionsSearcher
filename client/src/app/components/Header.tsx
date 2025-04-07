"use client"
import { Suspense } from "react";
import NavBar from "./NavBar";
import SearchBar from "./SearchBar";
import SearchBarSkele from "../skeletons/SearchBarSkele";

export default function Header() {
    return (
        <div className="flex flex-col w-[55%] max-w-[1050px] mx-auto my-1 px-1 py-1 rounded-lg shadow-md bg-gray-700 border border-gray-500 sticky top-2 z-50">
            <NavBar />
            <Suspense fallback={<SearchBarSkele />}>
                <SearchBar />
            </Suspense>
            <div className="text-[12px] text-gray-400">
                {`Your mouse dissapears when searching. I don't know why yet, but I'll keep looking for the fix.`}
            </div>
        </div>
    )
}
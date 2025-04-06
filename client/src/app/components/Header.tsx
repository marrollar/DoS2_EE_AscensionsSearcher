"use client"
import { Suspense } from "react";
import NavBar from "./NavBar";
import SearchBar from "./SearchBar";

export default function Header() {
    return (
        <div className="flex flex-col w-[55%] max-w-[1050px] mx-auto my-1 px-1 py-1 rounded-lg shadow-md bg-gray-700 border border-gray-500 sticky top-2 z-50">
            <NavBar />
            <Suspense>
                <SearchBar />
            </Suspense>
        </div>
    )
}
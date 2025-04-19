"use client"
import { Suspense } from "react";
import NavBar from "./navbar/NavBar";
import SearchBar from "./SearchBar";

export default function Header() {
    return (
        <div className="flex sticky top-1 z-50">
            <div className="flex flex-grow max-w-[1000px] flex-col mx-auto my-1 px-1 py-1 rounded bg-base-100 border border-base-300">
                <NavBar />
                <Suspense>
                    <SearchBar />
                </Suspense>
                <div className="text-[12px] text-gray-400">
                    {`Your mouse disappears when searching. I don't know why yet, but I'll keep looking for the fix.`}
                </div>
            </div>
        </div>
    )
}
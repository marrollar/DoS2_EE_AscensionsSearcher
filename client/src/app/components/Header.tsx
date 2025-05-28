import { Suspense } from "react";
import NavBar from "./navbar/NavBar";
import SearchBar from "./SearchBar";
import SearchBarSkeleton from "../skeletons/SearchBarSkeleton";

export default function Header() {
    return (
        <div className="flex sticky top-1 z-50">
            <div className="flex flex-grow max-w-[1000px] flex-col mx-auto my-1 px-1 py-1 rounded bg-base-100 border border-base-300">
                <NavBar />
                <Suspense fallback={<SearchBarSkeleton/>}>
                    <SearchBar />
                </Suspense>
            </div>
        </div>
    )
}
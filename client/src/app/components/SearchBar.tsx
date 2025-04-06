"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

import { useDebouncedCallback } from "use-debounce";

export default function SearchBar({ setSearchParams }: Readonly<{ setSearchParams: Dispatch<SetStateAction<string>> }>) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearchChange = useDebouncedCallback((term) => {
        const params = new URLSearchParams(searchParams)
        if (term) {
            params.set("query", term);
            setSearchParams(term)

            // const fuseSearch = fuse.search(term).sort((a, b) => {
            //     if (a.refIndex < b.refIndex) return -1;
            //     if (a.refIndex > b.refIndex) return 1;
            //     return 0;
            // })

            // const filteredAsc: IClusterData[] = []
            // fuseSearch.forEach((e) => {
            //     filteredAsc.push(e.item)
            // })

            // setFilteredAscensions(fattenAscensions(filteredAsc))

        } else {
            params.delete("query");
            setSearchParams("")
            // setFilteredAscensions(ascensionsData)
        }
        replace(`${pathname}?${params.toString()}`)
    }, 100)

    return (
        <input
            type="text"
            onChange={(e) => { handleSearchChange(e.target.value) }}
            className="mx-4 my-4 px-2 py-2 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Keyword search..."
            defaultValue={searchParams.get("query")?.toString()}
        >
        </input>
    )

}

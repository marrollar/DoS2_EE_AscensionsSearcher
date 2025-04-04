"use client"

import { AspectColors, Aspects } from "@/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import styles from "./AspectColors.module.css"
import { IClusterData } from "@/app/ascensions/page";
import SearchBar from "./search-bar";
import AspectHeader from "./aspect-header";

export default function AspectBox({
    aspect,
    clusters,
}: Readonly<{ aspect: Aspects, clusters: IClusterData[] }>) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearchChange = useDebouncedCallback((term) => {
        const params = new URLSearchParams(searchParams)
        if (term) {
            params.set("query", term);
        } else {
            params.delete("query");
        }
        replace(`${pathname}?${params.toString()}`)
    }, 300)

    return (
        <div className="">
            <SearchBar
                onChangeHandler={(e) => { handleSearchChange(e.target.value) }}
                defaultValue={searchParams.get("query")?.toString()}
            />
            <AspectHeader aspect={aspect} />
        </div>

    )
}
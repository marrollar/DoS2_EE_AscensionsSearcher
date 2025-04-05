"use client"

import AspectBox from "@/app/ascensions/components/aspectbox/AspectBox";
import SearchBar from "@/app/components/SearchBar";
import { Aspects } from "@/types";
import Fuse from "fuse.js";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { AscensionData } from "./page";

export const AspectContext = createContext(Aspects.Default);

const FuseOptions = {
    isCaseSensitive: false,
    // includeScore: false,
    // ignoreDiacritics: false,
    // shouldSort: true,
    // includeMatches: false,
    // findAllMatches: false,
    // minMatchCharLength: 1,
    // location: 0,
    threshold: 0.0,
    // distance: 100,
    // useExtendedSearch: false,
    ignoreLocation: true,
    // ignoreFieldNorm: false,
    // fieldNormWeight: 1,
    keys: [
        "title",
        "_nodesFlat.description",
        "_nodesFlat._subnodesFlat.original",
        "_nodesFlat._subnodesFlat.derpys"
    ]
};

export default function AscensionsClientPage({ ascensionsData }: Readonly<{ ascensionsData: AscensionData }>) {

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

    const ascensionsFlat = [
        ...ascensionsData[Aspects.Force],
        ...ascensionsData[Aspects.Entropy],
        ...ascensionsData[Aspects.Form],
        ...ascensionsData[Aspects.Inertia],
        ...ascensionsData[Aspects.Life]
    ]

    const fuse = new Fuse(ascensionsFlat, FuseOptions);
    const [filteredAscensions, setFilteredAscensions] = useState(ascensionsFlat);

    // const filteredAscensions = fuse.search(term)
    // console.log(filteredAscensions)

    return (
        <>
            <SearchBar
                onChangeHandler={(e) => { handleSearchChange(e.target.value) }}
                defaultValue={searchParams.get("query")?.toString()}
            />
            <AspectContext value={Aspects.Force}>
                <AspectBox clusters={ascensionsData[Aspects.Force]}></AspectBox>
            </AspectContext>

            <AspectContext value={Aspects.Entropy}>
                <AspectBox clusters={ascensionsData[Aspects.Entropy]}></AspectBox>
            </AspectContext>

            <AspectContext value={Aspects.Force}>
                <AspectBox clusters={ascensionsData[Aspects.Form]}></AspectBox>
            </AspectContext>

            <AspectContext value={Aspects.Inertia}>
                <AspectBox clusters={ascensionsData[Aspects.Inertia]}></AspectBox>
            </AspectContext>

            <AspectContext value={Aspects.Life}>
                <AspectBox clusters={ascensionsData[Aspects.Life]}></AspectBox>
            </AspectContext>

        </>
    )

}
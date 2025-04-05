"use client"

import AspectBox from "@/app/ascensions/components/aspectbox/AspectBox";
import SearchBar from "@/app/components/SearchBar";
import { Aspects } from "@/types";
import Fuse from "fuse.js";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { AscensionData, IClusterData } from "./page";

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

function fattenAscensions(flattenedAscensions: IClusterData[]) {
    const fattenedAscensions: AscensionData = {
        [Aspects.Force]: [],
        [Aspects.Entropy]: [],
        [Aspects.Form]: [],
        [Aspects.Inertia]: [],
        [Aspects.Life]: []
    };

    flattenedAscensions.forEach((cluster) => {
        fattenedAscensions[cluster.aspect].push(cluster)
    })

    return fattenedAscensions
}

export default function AscensionsClientPage({ ascensionsData }: Readonly<{ ascensionsData: AscensionData }>) {

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const ascensionsFlat = [
        ...ascensionsData[Aspects.Force],
        ...ascensionsData[Aspects.Entropy],
        ...ascensionsData[Aspects.Form],
        ...ascensionsData[Aspects.Inertia],
        ...ascensionsData[Aspects.Life]
    ]

    const fuse = new Fuse(ascensionsFlat, FuseOptions);
    const [filteredAscensions, setFilteredAscensions] = useState(ascensionsData);

    const handleSearchChange = useDebouncedCallback((term) => {
        const params = new URLSearchParams(searchParams)
        if (term) {
            params.set("query", term);

            const fuseSearch = fuse.search(term).sort((a, b) => {
                if (a.refIndex < b.refIndex) return -1;
                if (a.refIndex > b.refIndex) return 1;
                return 0;
            })

            const filteredAsc: IClusterData[] = []
            fuseSearch.forEach((e) => {
                filteredAsc.push(e.item)
            })

            setFilteredAscensions(fattenAscensions(filteredAsc))

        } else {
            params.delete("query");
            setFilteredAscensions(ascensionsData)
        }
        replace(`${pathname}?${params.toString()}`)
    }, 300)

    return (
        <>
            <SearchBar
                onChangeHandler={(e) => { handleSearchChange(e.target.value) }}
                defaultValue={searchParams.get("query")?.toString()}
            />
            <AspectContext value={Aspects.Force}>
                <AspectBox clusters={filteredAscensions[Aspects.Force]}></AspectBox>
            </AspectContext>

            <AspectContext value={Aspects.Entropy}>
                <AspectBox clusters={filteredAscensions[Aspects.Entropy]}></AspectBox>
            </AspectContext>

            <AspectContext value={Aspects.Force}>
                <AspectBox clusters={filteredAscensions[Aspects.Form]}></AspectBox>
            </AspectContext>

            <AspectContext value={Aspects.Inertia}>
                <AspectBox clusters={filteredAscensions[Aspects.Inertia]}></AspectBox>
            </AspectContext>

            <AspectContext value={Aspects.Life}>
                <AspectBox clusters={filteredAscensions[Aspects.Life]}></AspectBox>
            </AspectContext>

        </>
    )

}
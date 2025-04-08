"use client"

import AspectBox from "@/app/ascensions/components/aspectbox/AspectBox";
import { Aspects } from "@/app/types";
import { createContext } from "react";
import { AscensionData } from "../types";

export const AspectContext = createContext(Aspects.Default);

// const FuseOptions = {
//     isCaseSensitive: false,
//     // includeScore: false,
//     // ignoreDiacritics: false,
//     // shouldSort: true,
//     // includeMatches: false,
//     // findAllMatches: false,
//     // minMatchCharLength: 1,
//     // location: 0,
//     threshold: 0.0,
//     // distance: 100,
//     // useExtendedSearch: false,
//     ignoreLocation: true,
//     // ignoreFieldNorm: false,
//     // fieldNormWeight: 1,
//     keys: [
//         "title",
//         "_nodesFlat.description",
//         "_nodesFlat._subnodesFlat.original",
//         "_nodesFlat._subnodesFlat.derpys"
//     ]
// };

// function fattenAscensions(flattenedAscensions: IClusterData[]) {
//     const fattenedAscensions: AscensionData = {
//         [Aspects.Force]: [],
//         [Aspects.Entropy]: [],
//         [Aspects.Form]: [],
//         [Aspects.Inertia]: [],
//         [Aspects.Life]: []
//     };

//     flattenedAscensions.forEach((cluster) => {
//         fattenedAscensions[cluster.aspect].push(cluster)
//     })

//     return fattenedAscensions
// }

export default function AscensionsClientPage({ ascensionsData }: Readonly<{ ascensionsData: AscensionData }>) {
    // const [searchQuery] = useQueryState("query", { defaultValue: "" })

    // const ascensionsFlat = [
    //     ...ascensionsData[Aspects.Force],
    //     ...ascensionsData[Aspects.Entropy],
    //     ...ascensionsData[Aspects.Form],
    //     ...ascensionsData[Aspects.Inertia],
    //     ...ascensionsData[Aspects.Life]
    // ]

    // const fuse = new Fuse(ascensionsFlat, FuseOptions);
    // const [filteredAscensions, setFilteredAscensions] = useState(ascensionsData);
    return (
        <>
            <AspectContext value={Aspects.Force}>
                <AspectBox clusters={ascensionsData[Aspects.Force]}></AspectBox>
            </AspectContext>

            <AspectContext value={Aspects.Entropy}>
                <AspectBox clusters={ascensionsData[Aspects.Entropy]}></AspectBox>
            </AspectContext>

            <AspectContext value={Aspects.Form}>
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
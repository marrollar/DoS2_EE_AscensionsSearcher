"use client"

import AspectBox from "@/components/aspect-box";
import SearchBar from "@/components/search-bar";
import { Aspects } from "@/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { AscensionData } from "./page";

export default function AscensionsClientPage({ clusterData }: Readonly<{ clusterData: AscensionData }>) {

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
        <>
            <SearchBar
                onChangeHandler={(e) => { handleSearchChange(e.target.value) }}
                defaultValue={searchParams.get("query")?.toString()}
            />
            <AspectBox aspect={Aspects.Force} clusters={clusterData["Force"]}></AspectBox>
            <AspectBox aspect={Aspects.Entropy} clusters={clusterData["Entropy"]}></AspectBox>
            <AspectBox aspect={Aspects.Form} clusters={clusterData["Form"]}></AspectBox>
            <AspectBox aspect={Aspects.Inertia} clusters={clusterData["Inertia"]}></AspectBox>
            <AspectBox aspect={Aspects.Life} clusters={clusterData["Life"]}></AspectBox>
        </>
    )

}
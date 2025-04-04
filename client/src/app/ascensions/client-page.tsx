"use client"

import AspectBox from "@/app/ascensions/components/AspectBox";
import SearchBar from "@/components/SearchBar";
import { Aspects } from "@/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { AscensionData } from "./page";

export default function AscensionsClientPage({ clusterData: ascensionsData }: Readonly<{ clusterData: AscensionData }>) {

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
            <AspectBox aspect={Aspects.Force} clusters={ascensionsData["Force"]}></AspectBox>
            {/* <AspectBox aspect={Aspects.Entropy} clusters={ascensionsData["Entropy"]}></AspectBox>
            <AspectBox aspect={Aspects.Form} clusters={ascensionsData["Form"]}></AspectBox>
            <AspectBox aspect={Aspects.Inertia} clusters={ascensionsData["Inertia"]}></AspectBox>
            <AspectBox aspect={Aspects.Life} clusters={ascensionsData["Life"]}></AspectBox> */}
        </>
    )

}
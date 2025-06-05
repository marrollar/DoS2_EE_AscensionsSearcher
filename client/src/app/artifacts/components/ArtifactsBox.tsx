"use client"

import Image from "next/image"
import ArtifactsTable from "./ArtifactsTable"
import ArtifactsTitle from "./ArtifactsTitle"
import { useQueryState } from "nuqs"
import * as cheerio from "cheerio";

// TODO: Considering adding the equipment slot type that corresponds to the artifact. This data is already stored in the database file, it is just never used anywhere in the website code.

export default function ArtifactsBox({
    name,
    orig,
    derpys,
    icon
}: Readonly<{
    name: string,
    orig: string,
    derpys: string | null,
    icon: string | null
}>) {
    const [searchQuery] = useQueryState("query", { defaultValue: "" })
    const lowerQuery = searchQuery.toLowerCase()

    derpys = derpys ? derpys : ""

    const thereIsSearch = lowerQuery === "" ? false : true
    const origHasSearch = cheerio.load(orig).text().toLowerCase().includes(lowerQuery)
    const derpysHasSearch = cheerio.load(derpys).text().toLowerCase().includes(lowerQuery)
    const titleIsSearch = name.toLowerCase().includes(lowerQuery)

    const show = !thereIsSearch || origHasSearch || derpysHasSearch || titleIsSearch

    return (
        <div className={`bg-base-200 p-1 mb-6 rounded ${show ? "" : "hidden"}`}>
            <ArtifactsTitle name={name} />
            <hr className="border-t border-base-300" />
            <div className="flex flex-row">
                <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_PATH}/artifact_icons/${icon}.png`}
                    alt="Protected Image"
                    width={100}
                    height={100}
                    className="flex-none object-contain p-4"
                />
                <ArtifactsTable orig={orig} derpys={derpys ? derpys : ""} />
            </div>
        </div>
    )

}
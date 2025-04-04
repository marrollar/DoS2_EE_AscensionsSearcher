"use client"

import { IClusterData } from "@/app/ascensions/page";
import { Aspects } from "@/types";
import AspectHeader from "./aspect-header";

export default function AspectBox({
    aspect,
    clusters,
}: Readonly<{ aspect: Aspects, clusters: IClusterData[] }>) {
    return (
        <div className="">
            <AspectHeader aspect={aspect} />
        </div>

    )
}
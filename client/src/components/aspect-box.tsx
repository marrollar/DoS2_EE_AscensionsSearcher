"use client"

import { IClusterData } from "@/app/ascensions/page";
import { Aspects } from "@/types";
import AspectHeader from "./aspect-header";
import ClusterBox from "./cluster-box";

export default function AspectBox({
    aspect,
    clusters,
}: Readonly<{ aspect: Aspects, clusters: IClusterData[] }>) {
    return (
        <div className="">
            <AspectHeader aspect={aspect}>
                {
                    clusters.slice(0,1).map((c) => (
                        <div key={c.title}>
                            <ClusterBox cluster={c} />
                        </div>

                    ))
                }
            </AspectHeader >
        </div>

    )
}
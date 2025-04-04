"use client"

import { IClusterData } from "@/app/ascensions/page";
import { Aspects } from "@/types";
import AspectHeader from "./AspectHeader";
import ClusterBox from "./ClusterBox";

export default function AspectBox({
    aspect,
    clusters,
}: Readonly<{ aspect: Aspects, clusters: IClusterData[] }>) {
    return (
        <div className="">
            <AspectHeader aspect={aspect}>
                {
                    clusters.map((c) => (
                        <div key={aspect + c.title}>
                            <ClusterBox aspect={aspect} cluster={c} />
                        </div>

                    ))
                }
            </AspectHeader >
        </div>

    )
}
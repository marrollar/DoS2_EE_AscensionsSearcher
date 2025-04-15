"use client"

import { IClusterData } from "@/app/types";
import { useContext } from "react";
import { AspectContext } from "../../client-page";
import AspectHeader from "./AspectHeader";
import ClusterBox from "../clusterbox/ClusterBox";

export default function AspectBox({
    clusters,
}: Readonly<{ clusters: IClusterData[] }>) {

    const aspect = useContext(AspectContext)

    return (
        <div>
            <AspectHeader>
                {
                    clusters.map((c) => (
                        <div key={aspect + c.name}>
                            <ClusterBox cluster={c} />
                        </div>

                    ))
                }
            </AspectHeader>
        </div>

    )
}
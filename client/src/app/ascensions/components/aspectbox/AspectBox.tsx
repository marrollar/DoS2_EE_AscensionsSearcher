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
        <div className="">
            <AspectHeader>
                {
                    clusters.map((c) => (
                        <div key={aspect + c.title}>
                            <ClusterBox cluster={c} />
                        </div>

                    ))
                }
            </AspectHeader>
        </div>

    )
}
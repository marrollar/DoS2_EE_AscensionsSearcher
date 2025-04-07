"use client"

import { IClusterData } from "@/app/types";
import { useContext } from "react";
import { AspectContext } from "../../client-page";
import AspectHeader from "./AspectHeader";
import ClusterBox from "../clusterbox/ClusterBox";

export default function AspectBox({
    searchParams,
    clusters,
}: Readonly<{ searchParams: string, clusters: IClusterData[] }>) {

    const aspect = useContext(AspectContext)

    return (
        <div className="">
            <AspectHeader>
                {
                    clusters.map((c) => (
                        <div key={aspect + c.name}>
                            <ClusterBox searchParams={searchParams} cluster={c} />
                        </div>

                    ))
                }
            </AspectHeader>
        </div>

    )
}
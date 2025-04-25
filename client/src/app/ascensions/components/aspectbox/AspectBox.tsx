import { IClusterData } from "@/app/types";
import { Suspense, useContext } from "react";
import { AspectContext } from "../../client-page";
import AspectHeader from "./AspectHeader";
import ClusterBox from "../clusterbox/ClusterBox";
import ClusterBoxSkeleton from "@/app/skeletons/ClusterBoxSkeleton";

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
                            <Suspense fallback={<ClusterBoxSkeleton />}>
                                <ClusterBox cluster={c} />
                            </Suspense>
                        </div>
                    ))
                }
            </AspectHeader>
        </div>

    )
}
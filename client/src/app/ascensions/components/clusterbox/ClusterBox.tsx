import { IClusterData } from "@/app/types"
import Fuse from "fuse.js"
import { createContext, useContext } from "react"
import { AspectContext } from "../../client-page"
import NodeRow from "../nodetable/NodeRow"
import ClusterFlavor from "./ClusterFlavor"
import ClusterRequirementRewards from "./ClusterRequirementRewards"
import ClusterTitle from "./ClusterTitle"

type ClusterCtxType = {
    clusterName: string,
    mainNodeID: string
}

export const ClusterCtx = createContext<ClusterCtxType>(null!);

const FuseOptions = {
    isCaseSensitive: false,
    // includeScore: false,
    // ignoreDiacritics: false,
    // shouldSort: true,
    // includeMatches: false,
    // findAllMatches: false,
    // minMatchCharLength: 1,
    // location: 0,
    threshold: 0.0,
    // distance: 100,
    // useExtendedSearch: false,
    ignoreLocation: true,
    // ignoreFieldNorm: false,
    // fieldNormWeight: 1,
    keys: [
        "description",
        "_subnodesFlat.original",
        "_subnodesFlat.derpys"
    ]
};

export default function ClusterBox({ searchParams, cluster }: Readonly<{ searchParams: string, cluster: IClusterData }>) {
    const aspect = useContext(AspectContext)

    const clusterMainDescription = cluster.description
    const clusterNodes = cluster.nodes

    let clusterReqRew = cluster.rewards
    clusterReqRew = clusterReqRew.replace("Requires:", "Required:").replace("Completion grants:", "Completion:").replaceAll("<br>", "")
    const reqRew_parts = clusterReqRew.split(".")

    const titleIsSearch = cluster.name.toLowerCase().includes(searchParams.toLowerCase())

    const flattenedSubNodes = Object.values(clusterNodes)
    const fuse = new Fuse(flattenedSubNodes, FuseOptions);
    const subNodesWithSearchStr = fuse.search(searchParams)

    const showCluster = titleIsSearch || subNodesWithSearchStr.length > 0 || searchParams === ""

    return (
        <div id={cluster.id} className={`bg-[#202020] mt-4 px-2 pb-3 scroll-m-38 ${showCluster ? "" : "hidden"}`}>
            <ClusterTitle clusterName={cluster.name} />
            <ClusterFlavor desc={clusterMainDescription} />
            <ClusterRequirementRewards requirements={reqRew_parts[0]} rewards={reqRew_parts[1]} />
            {
                Object.keys(clusterNodes).map((mainNodeID) => (
                    <div key={aspect + cluster.name + mainNodeID}>
                        <ClusterCtx value={{
                            clusterName: cluster.name,
                            mainNodeID: mainNodeID
                        }}>
                            <NodeRow
                                searchParams={searchParams}
                                subNodes={clusterNodes[mainNodeID].subnodes}
                                implicit={clusterNodes[mainNodeID].hasImplicit ? clusterNodes[mainNodeID].description : ""}
                            />
                        </ClusterCtx>
                    </div>
                ))
            }
        </div>
    )
}
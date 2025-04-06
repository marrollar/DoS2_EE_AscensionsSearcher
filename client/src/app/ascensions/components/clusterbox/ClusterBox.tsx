import { Aspect_Txt_Color, Aspects, IClusterData } from "@/app/types"
import * as cheerio from "cheerio"
import { createContext, useContext } from "react"
import { AspectContext } from "../../client-page"
import NodeRow from "../nodetable/NodeRow"
import ClusterDescription from "./ClusterDescription"
import ClusterRequirementRewards from "./ClusterRequirementRewards"
import ClusterTitle from "./ClusterTitle"
import Fuse from "fuse.js"

type ClusterCtxType = {
    aspect: Aspects,
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

    const $title = cheerio.load(cluster.title)
    $title("font").attr("color", Aspect_Txt_Color[aspect].slice(1))
    const clusterName = $title.html()
    const clusterMainDescription = cluster.description
    const clusterNodes = cluster.nodes

    let clusterReqRew = cluster.rewards
    clusterReqRew = clusterReqRew.replace("Requires:", "Required:").replace("Completion grants:", "Completion:").replaceAll("<br>", "")
    const reqRew_parts = clusterReqRew.split(".")

    const titleIsSearch = $title.text().toLowerCase().includes(searchParams.toLowerCase())

    const flattenedSubNodes = Object.values(clusterNodes)
    const fuse = new Fuse(flattenedSubNodes, FuseOptions);
    const subNodesWithSearchStr = fuse.search(searchParams)

    const showCluster = titleIsSearch || subNodesWithSearchStr.length > 0 || searchParams === ""

    return (
        <div className={`bg-[#202020] mt-4 px-2 pb-3 ${showCluster ? "" : "hidden"}`}>
            <ClusterTitle __html={clusterName} />
            <ClusterDescription desc={clusterMainDescription} />
            <ClusterRequirementRewards requirements={reqRew_parts[0]} rewards={reqRew_parts[1]} />
            {
                Object.keys(clusterNodes).map((mainNodeID) => (
                    <div key={aspect + clusterName + mainNodeID}>
                        <ClusterCtx value={{
                            aspect: aspect,
                            clusterName: clusterName,
                            mainNodeID: mainNodeID
                        }}>
                            <NodeRow
                                searchParams={searchParams}
                                mainNode={mainNodeID}
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
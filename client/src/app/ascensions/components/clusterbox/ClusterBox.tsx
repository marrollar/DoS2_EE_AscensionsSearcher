import { IClusterData } from "@/app/types"
import { Aspect_Txt_Color, Aspects } from "@/app/types"
import * as cheerio from "cheerio"
import { createContext, useContext } from "react"
import { AspectContext } from "../../client-page"
import NodeRow from "../nodetable/NodeRow"
import ClusterDescription from "./ClusterDescription"
import ClusterRequirementRewards from "./ClusterRequirementRewards"
import ClusterTitle from "./ClusterTitle"

type ClusterCtxType = {
    aspect: Aspects,
    clusterName: string,
    mainNodeID: string
}

export const ClusterCtx = createContext<ClusterCtxType>(null!);

export default function ClusterBox({ cluster }: Readonly<{ cluster: IClusterData }>) {
    const aspect = useContext(AspectContext)

    const $ = cheerio.load(cluster.title)
    $("font").attr("color", Aspect_Txt_Color[aspect].slice(1))
    const cluster_Name = $.html()
    const cluster_MainDescription = cluster.description
    const cluster_Nodes = cluster.nodes

    let cluster_ReqRew = cluster.rewards
    cluster_ReqRew = cluster_ReqRew.replace("Requires:", "Required:").replace("Completion grants:", "Completion:").replaceAll("<br>", "")
    const reqRew_parts = cluster_ReqRew.split(".")

    return (
        <div className="bg-[#202020] mt-4 px-2 pb-3">
            <ClusterTitle __html={cluster_Name} />
            <ClusterDescription desc={cluster_MainDescription} />
            <ClusterRequirementRewards requirements={reqRew_parts[0]} rewards={reqRew_parts[1]} />
            {
                Object.keys(cluster_Nodes).map((mainNodeID) => (
                    <div key={aspect + cluster_Name + mainNodeID}>
                        <ClusterCtx value={{
                            aspect: aspect,
                            clusterName: cluster_Name,
                            mainNodeID: mainNodeID
                        }}>
                            <NodeRow
                                mainNode={mainNodeID}
                                subNodes={cluster_Nodes[mainNodeID].subnodes}
                                implicit={cluster_Nodes[mainNodeID].hasImplicit ? cluster_Nodes[mainNodeID].description : ""}
                            />
                        </ClusterCtx>
                    </div>
                ))
            }
        </div>
    )
}
import { IClusterData } from "@/app/ascensions/page"
import { Aspect_Txt_Color } from "@/types"
import * as cheerio from "cheerio"
import { createContext, useContext } from "react"
import { AspectContext } from "../../client-page"
import NodeRow from "../nodetable/NodeRow"
import ClusterDescription from "./ClusterDescription"
import ClusterRequirementRewards from "./ClusterRequirementRewards"
import ClusterTitle from "./ClusterTitle"

export const ClusterContext = createContext("");

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
                        <ClusterContext value={aspect + cluster_Name + mainNodeID}>
                            <NodeRow
                                mainNode={mainNodeID}
                                subNodes={cluster_Nodes[mainNodeID].subnodes}
                                implicit={cluster_Nodes[mainNodeID].hasImplicit ? cluster_Nodes[mainNodeID].description : ""}
                            />
                        </ClusterContext>
                    </div>
                ))
            }
        </div>
    )
}
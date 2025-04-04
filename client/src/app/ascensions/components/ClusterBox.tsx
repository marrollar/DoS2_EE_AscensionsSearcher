import { IClusterData } from "@/app/ascensions/page"
import NodeBox from "./NodeBox"

export default function ClusterBox({ cluster }: Readonly<{ cluster: IClusterData }>) {
    const cluster_Name = cluster.title
    const cluster_MainDescription = cluster.description
    const cluster_Nodes = cluster.nodes

    let cluster_ReqRew = cluster.rewards
    cluster_ReqRew = cluster_ReqRew.replace("Requires:", "Required:").replace("Completion grants:", "Completion:").replaceAll("<br>", "")
    const reqRew_parts = cluster_ReqRew.split(".")

    return (
        <div className="bg-[#202020] mt-1 px-2">
            <div className="text-center text-[24px]" dangerouslySetInnerHTML={{ __html: cluster_Name }} />
            <div className="text-center">
                {cluster_MainDescription}
            </div>
            <div className="flex w-[100%] my-3">
                <div className="w-1/2 text-center">
                    <div dangerouslySetInnerHTML={{ __html: reqRew_parts[0] }} />
                </div>
                <div className="w-1/2 text-center">
                    <div dangerouslySetInnerHTML={{ __html: reqRew_parts[1] }} />
                </div>
            </div>
            {
                Object.keys(cluster_Nodes).map((key) => (
                    <div key={cluster_Name + key}>
                        <NodeBox parentKey={cluster_Name + key} mainNode={key} subNodes={cluster_Nodes[key].subnodes} />
                    </div>
                ))
            }
        </div>
    )
}
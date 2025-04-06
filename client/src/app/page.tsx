
import { getDerpysByCluster, getDescription_By_ClusterAndAttr, getOriginal_MainNodes_By_Cluster, getOriginal_SubNodes_By_Cluster } from "@/app/db/queries";
import { AscensionData, Aspects, CLUSTER_ORDER, IClusterData, IMainNode, stringToAspect } from "@/app/types";
import { Suspense } from "react";
import AscensionsClientPage from "./ascensions/client-page";
import SideBar from "./components/SideBar";

async function getAscensionsData() {

    const ascensionsData: AscensionData = {
        [Aspects.Force]: [],
        [Aspects.Entropy]: [],
        [Aspects.Form]: [],
        [Aspects.Inertia]: [],
        [Aspects.Life]: []
    };

    for (const aspectStr in CLUSTER_ORDER) {

        const aspect = stringToAspect[aspectStr]

        for (const cluster of CLUSTER_ORDER[aspect]) {
            const nodes: { [key: string]: IMainNode } = {};

            const mainNodes = await getOriginal_MainNodes_By_Cluster(cluster);
            mainNodes.forEach(e => {
                const mainNode = e.attr.split(" ")[1];

                nodes[mainNode] = {
                    description: e.description,
                    subnodes: {},
                    hasImplicit: e.has_implicit ? true : false,
                    _subnodesFlat: []
                }
            })

            const subNodes = await getOriginal_SubNodes_By_Cluster(cluster);
            subNodes.forEach(e => {
                const tokens = e.attr.split(" ")[1].split(".");
                const mainNode = tokens[0]
                const subNode = tokens[1];

                nodes[mainNode].subnodes[subNode] = { original: e.description }
            })

            const derpysNodes = await getDerpysByCluster(cluster);
            derpysNodes.forEach(e => {
                const tokens = e.node.split(" ")[1].split(".");
                const mainNode = tokens[0]
                const subNode = tokens[1];

                try {
                    nodes[mainNode].subnodes[subNode].derpys = e.description
                } catch (error: unknown) {
                    if (error instanceof TypeError) {
                        // We assume that, in any circumstance that a pre-existing node failed to be found, that it is a new node added by Derpy or some other mod instead.
                        nodes[mainNode].subnodes[subNode] = {
                            original: "",
                            derpys: e.description
                        }
                    } else {
                        throw error
                    }
                }
            })

            Object.values(nodes).map(mainNodeData => {
                mainNodeData._subnodesFlat = Object.entries(mainNodeData.subnodes).map(([subNodes, snData]) => ({
                    subNodes,
                    ...snData
                }))
            });

            const data: IClusterData = {
                title: (await getDescription_By_ClusterAndAttr(cluster, "Title"))["description"],
                description: (await getDescription_By_ClusterAndAttr(cluster, "Desc"))["description"],
                rewards: (await getDescription_By_ClusterAndAttr(cluster, "Rewards"))["description"],
                aspect: aspect,
                nodes: nodes,
                _nodesFlat: Object.entries(nodes).map(([mainNode, subNodes]) => ({
                    mainNode,
                    ...subNodes
                }))
            }
            ascensionsData[aspect].push(data)
        }
    }

    return ascensionsData

}

export default async function AscensionsHome() {

    const ascensionsData = await getAscensionsData();
    // TODO: Make proper skeleton for this suspense
    return (
        <Suspense>
            <div className="flex flex-col w-[60%] max-w-[1100px] mx-auto my-2 px-1 py-1 rounded-lg shadow-md bg-gray-700">
                <SideBar ascensionsData={ascensionsData} />
                <AscensionsClientPage ascensionsData={ascensionsData} />
            </div>
        </Suspense>
    )
}
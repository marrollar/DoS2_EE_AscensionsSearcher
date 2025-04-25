
import { getDerpysByCluster, getDescription_By_ClusterAndAttr, getOriginal_MainNodes_By_Cluster, getOriginal_SubNodes_By_Cluster } from "@/app/db/queries";
import { AscensionData, Aspects, CLUSTER_ORDER, IClusterData, IMainNode, stringToAspect } from "@/app/types";
import AscensionsClientPage from "./ascensions/client-page";
import SideDrawer from "./ascensions/components/sidebar/SideDrawer";

async function processMainNodes(
    cluster: string,
    nodes: {
        [key: string]: IMainNode
    }) {

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
}

async function processSubNodes(
    cluster: string,
    nodes: {
        [key: string]: IMainNode
    }) {
    const subNodes = await getOriginal_SubNodes_By_Cluster(cluster);
    subNodes.forEach(e => {
        const tokens = e.attr.split(" ")[1].split(".");
        const mainNode = tokens[0]
        const subNode = tokens[1];

        nodes[mainNode].subnodes[subNode] = { original: e.description }
    })
}

async function processDerpys(
    cluster: string,
    nodes: {
        [key: string]: IMainNode
    }) {
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
}

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

        for (const tier in CLUSTER_ORDER[aspect]) {
            for (const cluster of CLUSTER_ORDER[aspect][tier]) {
                const nodes: { [key: string]: IMainNode } = {};

                await processMainNodes(cluster, nodes)
                await processSubNodes(cluster, nodes)
                await processDerpys(cluster, nodes)

                Object.values(nodes).map(mainNodeData => {
                    mainNodeData._subnodesFlat = Object.entries(mainNodeData.subnodes).map(([subNodes, snData]) => ({
                        subNodes,
                        ...snData
                    }))
                });

                const data: IClusterData = {
                    id: cluster.replaceAll(" ", ""),
                    name: cluster,
                    description: (await getDescription_By_ClusterAndAttr(cluster, "Desc"))["description"],
                    rewards: (await getDescription_By_ClusterAndAttr(cluster, "Rewards"))["description"],
                    aspect: aspect,
                    nodes: nodes,
                    tier: tier,
                    _nodesFlat: Object.entries(nodes).map(([mainNode, subNodes]) => ({
                        mainNode,
                        ...subNodes
                    }))
                }
                ascensionsData[aspect].push(data)
            }
        }
    }

    return ascensionsData

}

export default async function AscensionsHome() {

    const ascensionsData = await getAscensionsData();

    return (
        <div className="flex flex-col max-w-[1050px] mx-auto my-2 px-1 py-1 rounded-tr rounded-br bg-base-100 border border-base-300">
            <SideDrawer ascensionsData={ascensionsData} />
            <AscensionsClientPage ascensionsData={ascensionsData} />
        </div>

    )
}

import { Aspects, stringToAspect } from "@/types";
import { getDerpysByCluster, getDescription_By_ClusterAndAttr, getOriginal_MainNodes_By_Cluster, getOriginal_SubNodes_By_Cluster } from "../../../db/queries";
import AscensionsClientPage from "./client-page";

type ICluster_Order = {
    [key in Aspects]: string[]
}

const CLUSTER_ORDER: ICluster_Order = {
    [Aspects.Force]: [
        "The Hatchet",
        "The Hornet",
        "The Serpent",
        "The Falcon",
        "The Scorpion",
        "The Manticore",
        "The Arcanist",
        "The Tiger",
        "The Archer",
        "The Conqueror",
        "The Kraken",
        "Wrath"
    ],
    [Aspects.Entropy]: [
        "The Fly",
        "The Wolf",
        "The Vulture",
        "The Crow",
        "The Supplicant",
        "The Imp",
        "The Hyena",
        "Extinction",
        "BloodApe",
        "Death",
        "Decay",
        "Demilich",
    ],
    [Aspects.Form]: [
        "The Key",
        "The Nautilus",
        "The Silkworm",
        "The Chalice",
        "The Gryphon",
        "Wealth",
        "The Basilisk",
        "The Dragon",
        "Doppelganger",
        "Cerberus",
        "Sphinx",
        "The Ritual",
    ],
    [Aspects.Inertia]: [
        "The Armadillo",
        "The Auroch",
        "The Guardsman",
        "The Crab",
        "The Centurion",
        "The Rhinoceros",
        "The Casque",
        "The Hippopotamus",
        "The Gladiator",
        "Champion",
        "Fortress",
        "The Arena",
    ],
    [Aspects.Life]: [
        "The Rabbit",
        "The Hind",
        "The Lizard",
        "The Beetle",
        "Pegasus",
        "The Stag",
        "The Huntress",
        "The Nymph",
        "The Enchantress",
        "Splendor",
        "The Goddess",
        "Hope",
    ],
    [Aspects.Default]: []
}

export interface ISubNode {
    original: string,
    derpys?: string
}

export interface IMainNode {
    description: string,
    hasImplicit: boolean,
    subnodes: {
        [key: string]: ISubNode
    },
    _subnodesFlat: ISubNode[]
}

export interface IClusterNodes {
    [key: string]: IMainNode
}

export interface IClusterData {
    title: string,
    description: string,
    rewards: string,
    aspect: string,
    nodes: IClusterNodes,
    _nodesFlat: IMainNode[]
}

export interface AscensionData {
    [key: string]: IClusterData[]
}

async function getAscensionsData() {

    const ascensionsData: AscensionData = {
        "Force": [],
        "Entropy": [],
        "Form": [],
        "Inertia": [],
        "Life": []
    };

    for (const aspectStr in CLUSTER_ORDER) {

        const aspect = stringToAspect[aspectStr]

        for (const cluster of CLUSTER_ORDER[aspect]) {
            const nodes: IClusterNodes = {};

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

    return (
        <>
            <AscensionsClientPage ascensionsData={ascensionsData} />
        </>
    )
}
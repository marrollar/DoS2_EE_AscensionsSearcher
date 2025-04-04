
import { getDerpysByCluster, getDescription_By_ClusterAndAttr, getOriginal_MainNodes_By_Cluster, getOriginal_SubNodes_By_Cluster } from "../../../db/queries";
import AscensionsClientPage from "./client-page";

interface ICluster_Order {
    [key: string]: string[]
}

const CLUSTER_ORDER: ICluster_Order = {
    Force: [
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
    Entropy: [
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
    Form: [
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
    Inertia: [
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
    Life: [
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
    ]
}

export interface INodeData {
    [key: number]: {
        description: string,
        subnodes: {
            [key: number]: {
                original: string,
                derpys?: string
            }
        },
    }
}

export interface IClusterData {
    title: string,
    description: string,
    rewards: string,
    aspect: string,
    nodes: INodeData
}

export interface AscensionData {
    [key: string]: IClusterData[]
}

async function getClusterData() {

    const clusterData: AscensionData = {
        "Force": [],
        "Entropy": [],
        "Form": [],
        "Inertia": [],
        "Life": []
    };

    for (const aspect in CLUSTER_ORDER) {
        for (const cluster of CLUSTER_ORDER[aspect]) {
            const nodes: INodeData = {};

            const mainNodes = await getOriginal_MainNodes_By_Cluster(cluster);
            mainNodes.forEach(e => {
                const mainNode = e.attr.split(" ")[1];
                nodes[parseInt(mainNode, 10)] = {
                    description: e.description,
                    subnodes: {}
                }
            })

            const subNodes = await getOriginal_SubNodes_By_Cluster(cluster);
            subNodes.forEach(e => {
                const mainNode = e.attr.split(" ")[1];
                const subNode = mainNode.split(".")[1];

                nodes[parseInt(mainNode, 10)].subnodes[parseInt(subNode, 10)] = { original: e.description }
            })

            const derpysNodes = await getDerpysByCluster(cluster);
            derpysNodes.forEach(e => {
                const mainNode = e.node.split(" ")[1]
                const subNode = mainNode.split(".")[1]

                try {
                    nodes[parseInt(mainNode, 10)].subnodes[parseInt(subNode, 10)].derpys = e.description
                } catch (error: unknown) {
                    if (error instanceof TypeError) {
                        // We assume that in any circumstance that a pre-existing node failed to be found, that it is a new node added by Derpy or some other mod instead.
                        nodes[parseInt(mainNode, 10)].subnodes[parseInt(subNode, 10)] = {
                            original: "",
                            derpys: e.description
                        }
                    } else {
                        throw error
                    }
                }

            })

            const data: IClusterData = {
                title: (await getDescription_By_ClusterAndAttr(cluster, "Title"))["description"],
                description: (await getDescription_By_ClusterAndAttr(cluster, "Desc"))["description"],
                rewards: (await getDescription_By_ClusterAndAttr(cluster, "Rewards"))["description"],
                aspect: aspect,
                nodes: nodes
            }

            clusterData[aspect].push(data)
        }
    }

    return clusterData

}

export default async function AscensionsHome() {

    const clusterData = await getClusterData();

    return (
        <>
            <AscensionsClientPage clusterData={clusterData} />
        </>
    )
}
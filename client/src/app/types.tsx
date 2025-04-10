
export enum Aspects {
    Force = "Force",
    Life = "Life",
    Entropy = "Entropy",
    Form = "Form",
    Inertia = "Inertia",
    Default = "Default"
}

export const stringToAspect: { [key: string]: Aspects } = {
    "Force": Aspects.Force,
    "Life": Aspects.Life,
    "Entropy": Aspects.Entropy,
    "Form": Aspects.Form,
    "Inertia": Aspects.Inertia,
    "Default": Aspects.Default
}

export const Aspect_BG_Colors: { [id in Aspects]: string } = {
    Force: "#280505",
    Life: "#282805",
    Entropy: "#280028",
    Form: "#052805",
    Inertia: "#052828",
    Default: ""
}

export const Aspect_Txt_Color: { [id in Aspects]: string } = {
    Force: "#e67f7f",
    Life: "#c1a757",
    Entropy: "#beb3ff",
    Form: "#4ae88c",
    Inertia: "#73b3f2",
    Default: ""
}
export type ICluster_Order = {
    [key: string]: {
        [key: string]: string[]
    };
}; export const CLUSTER_ORDER: ICluster_Order = {
    [Aspects.Force]: {
        "Tier 1": [
            "The Hatchet",
            "The Hornet",
            "The Serpent",
            "The Falcon",
        ],
        "Tier 2": [
            "The Scorpion",
            "The Manticore",
            "The Arcanist",
            "The Tiger",
            "The Archer",
        ],
        "Tier 3": [
            "The Conqueror",
            "The Kraken",
            "Wrath"
        ],
    },
    [Aspects.Entropy]: {
        "Tier 1": [
            "The Fly",
            "The Wolf",
            "The Vulture",
            "The Crow",
        ],
        "Tier 2": [
            "The Supplicant",
            "The Imp",
            "The Hyena",
            "Extinction",
            "BloodApe",
        ],
        "Tier 3": [

            "Death",
            "Decay",
            "Demilich",
        ],
    },
    [Aspects.Form]: {
        "Tier 1": [
            "The Key",
            "The Nautilus",
            "The Silkworm",
            "The Chalice",
        ],
        "Tier 2": [
            "The Gryphon",
            "Wealth",
            "The Basilisk",
            "The Dragon",
            "Doppelganger",
        ],
        "Tier 3": [
            "Cerberus",
            "Sphinx",
            "The Ritual",
        ],
    },
    [Aspects.Inertia]: {
        "Tier 1": [
            "The Armadillo",
            "The Auroch",
            "The Guardsman",
            "The Crab",
        ],
        "Tier 2": [
            "The Centurion",
            "The Rhinoceros",
            "The Casque",
            "The Hippopotamus",
            "The Gladiator",
        ],
        "Tier 3": [
            "Champion",
            "Fortress",
            "The Arena",
        ],
    },
    [Aspects.Life]: {
        "Tier 1": [
            "The Rabbit",
            "The Hind",
            "The Lizard",
            "The Beetle",
        ],
        "Tier 2": [
            "Pegasus",
            "The Stag",
            "The Huntress",
            "The Nymph",
            "The Enchantress",
        ],
        "Tier 3": [
            "Splendor",
            "The Goddess",
            "Hope",
        ],
    },
};

export interface ISubNode {
    original: string;
    derpys?: string;
}
export interface IMainNode {
    description: string;
    hasImplicit: boolean;
    subnodes: {
        [key: string]: ISubNode;
    };
    _subnodesFlat: ISubNode[];
}
export interface IClusterData {
    id: string,
    name: string;
    description: string;
    rewards: string;
    aspect: string;
    tier: string;
    nodes: { [key: string]: IMainNode; };
    _nodesFlat: IMainNode[];
}
export interface AscensionData {
    [key: string]: IClusterData[];
}


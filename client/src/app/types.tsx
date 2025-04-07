
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
    [key: string]: string[];
}; export const CLUSTER_ORDER: ICluster_Order = {
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
    id:string,
    name: string;
    description: string;
    rewards: string;
    aspect: string;
    nodes: { [key: string]: IMainNode; };
    _nodesFlat: IMainNode[];
}
export interface AscensionData {
    [key: string]: IClusterData[];
}


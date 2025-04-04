export enum Aspects {
    Force = "Force",
    Life = "Life",
    Entropy = "Entropy",
    Form = "Form",
    Inertia = "Inertia"
}

export const AspectColors: { [id in Aspects]: string } = {
    Force: "#280505",
    Life: "#282805",
    Entropy: "#280028",
    Form: "#052805",
    Inertia: "#052828"
}
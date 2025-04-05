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
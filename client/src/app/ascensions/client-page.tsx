
"use client"

import AspectBox from "@/app/ascensions/components/aspectbox/AspectBox";
import { Aspects } from "@/app/types";
import { createContext } from "react";
import { AscensionData } from "../types";

export const AspectContext = createContext(Aspects.Default);

export default function AscensionsClientPage({ ascensionsData }: Readonly<{ ascensionsData: AscensionData }>) {
    return (
        <>
            <AspectContext value={Aspects.Force}>
                <AspectBox clusters={ascensionsData[Aspects.Force]}></AspectBox>
            </AspectContext>

            <AspectContext value={Aspects.Entropy}>
                <AspectBox clusters={ascensionsData[Aspects.Entropy]}></AspectBox>
            </AspectContext>

            <AspectContext value={Aspects.Form}>
                <AspectBox clusters={ascensionsData[Aspects.Form]}></AspectBox>
            </AspectContext>

            <AspectContext value={Aspects.Inertia}>
                <AspectBox clusters={ascensionsData[Aspects.Inertia]}></AspectBox>
            </AspectContext>

            <AspectContext value={Aspects.Life}>
                <AspectBox clusters={ascensionsData[Aspects.Life]}></AspectBox>
            </AspectContext>
        </>
    )

}
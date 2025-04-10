"use client"

import { AscensionData, Aspects, stringToAspect } from "@/app/types";
import { aspectToTextCSS } from "@/app/utils";
import { useState } from "react";
import SideBarButton from "./SideBarButton";
import SidebarSearchBar from "./SideBarSearchBar";

export default function SideBarAscensionsContent({ ascensionsData }: Readonly<{ ascensionsData: AscensionData }>) {
    const [sideBarSearch, setSideBarSearch] = useState("");

    const allClusterTitles: {
        [aspect in Aspects]: {
            [key: string]: {
                href: string,
                name: string,
                color: string
            }[]
        }
    } = {
        Force: {
            "Tier 1": [],
            "Tier 2": [],
            "Tier 3": []
        },
        Life: {
            "Tier 1": [],
            "Tier 2": [],
            "Tier 3": []
        },
        Entropy: {
            "Tier 1": [],
            "Tier 2": [],
            "Tier 3": []
        },
        Form: {
            "Tier 1": [],
            "Tier 2": [],
            "Tier 3": []
        },
        Inertia: {
            "Tier 1": [],
            "Tier 2": [],
            "Tier 3": []
        },
        Default: {},
    }

    Object.entries(ascensionsData).map(([asp, ascData]) => {
        const aspect = stringToAspect[asp];
        const title_text_color = aspectToTextCSS(aspect)

        ascData.forEach((clusterData) => {
            const tier = clusterData.tier

            allClusterTitles[aspect][tier].push({
                href: "#" + clusterData.id,
                name: clusterData.name,
                color: title_text_color
            })
        })
    })

    // TODO: Determine whether to include aspect and tier separators

    return (
        <>
            {/* Sidebar content here */}
            <p className="text-2xl py-3">Clusters</p>
            <hr className="border-t border-gray-300/25" />
            <SidebarSearchBar sideBarSearch={sideBarSearch} setSideBarSearch={setSideBarSearch} />
            {/* <SideBarDivider aspect="Force"/> */}
            {
                Object.values(allClusterTitles).map((tierData) =>
                    Object.values(tierData).map((clusters) =>
                        clusters.map((cluster) => {
                            return (
                                <div key={"sidebar" + cluster.name}>
                                    <SideBarButton clusterName={cluster.name} sideBarSearch={sideBarSearch} color={cluster.color} />
                                </div>
                            )
                        })
                    )
                )
            }
            {/* </SideBarDivider> */}
        </>
    )
}
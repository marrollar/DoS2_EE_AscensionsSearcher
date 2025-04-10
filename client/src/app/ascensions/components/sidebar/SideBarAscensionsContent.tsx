"use client"

import { AscensionData } from "@/app/types";
import { aspectToTextCSS } from "@/app/utils";
import { useState } from "react";
import SideBarButton from "./SideBarButton";
import SidebarSearchBar from "./SideBarSearchBar";

export default function SideBarAscensionsContent({ ascensionsData }: Readonly<{ ascensionsData: AscensionData }>) {
    const [sideBarSearch, setSideBarSearch] = useState("");

    const allClusterTitles: {
        [key: string]: {
            href: string,
            name: string,
            color: string
        }
    }[] = []

    Object.entries(ascensionsData).map(([aspect, ascData]) => {
        const title_text_color = aspectToTextCSS(aspect)

        ascData.forEach((clusterData) => {
            const tier = clusterData.tier

            allClusterTitles.push({
                href: "#" + clusterData.id,
                name: clusterData.name,
                color: title_text_color
            })
        })
    })

    return (
        <>
            {/* Sidebar content here */}
            <p className="text-2xl py-3">Clusters</p>
            <hr className="border-t border-gray-300/25" />
            <SidebarSearchBar sideBarSearch={sideBarSearch} setSideBarSearch={setSideBarSearch} />
            {/* <SideBarDivider aspect="Force"/> */}
            {
                allClusterTitles.map((cluster) => (
                    <div key={"sidebar" + cluster.name}>
                        <SideBarButton clusterName={cluster.name} sideBarSearch={sideBarSearch} color={cluster.color} />
                    </div>
                ))
            }
            {/* </SideBarDivider> */}
        </>
    )
}
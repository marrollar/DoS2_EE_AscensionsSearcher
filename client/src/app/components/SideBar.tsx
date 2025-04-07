"use client"

import { useQueryState } from "nuqs";
import { AscensionData } from "../types";
import { aspectToTextCSS } from "../utils";
import SideBarButton from "./SideBarButton";

export default function SideBar({ ascensionsData }: Readonly<{ ascensionsData: AscensionData }>) {
    const [searchParams] = useQueryState("query", { defaultValue: "" })

    const allClusterTitles: {
        href: string,
        name: string,
        color: string
    }[] = []

    Object.entries(ascensionsData).map(([aspect, ascData]) => {
        const title_text_color = aspectToTextCSS(aspect)

        ascData.forEach((clusterData) => {
            const titleInSearch = searchParams !== "" || clusterData.name.toLowerCase().includes(searchParams.toLowerCase())

            if (titleInSearch) {
                allClusterTitles.push({
                    href: "#" + clusterData.id,
                    name: clusterData.name,
                    color: title_text_color
                })
            }
        })
    })

    return (
        <div className={`fixed w-[10%] p-1 min-w-[200px] translate-x-[calc(-100%-8px)] translate-y-[-4px] h-[50%] bg-gray-700 rounded-lg overflow-scroll`}>
            <div className="bg-gray-800 px-2 rounded-lg ">
                <p className="text-2xl py-3">Clusters</p>
                <hr className="border-t border-gray-300/25" />
                {
                    allClusterTitles.map((cluster) => (
                        <div key={"sidebar" + cluster.name}>
                            <SideBarButton clusterName={cluster.name} color={cluster.color} />
                        </div>
                    ))
                }
            </div>
        </div>
    );
}
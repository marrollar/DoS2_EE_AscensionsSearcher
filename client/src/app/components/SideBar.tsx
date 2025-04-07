"use client"

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AscensionData } from "../types";
import { aspectToTextCSS } from "../utils";

export default function SideBar({ ascensionsData }: Readonly<{ ascensionsData: AscensionData }>) {
    const usp = useSearchParams();
    let searchParams = usp.get("query")
    if (searchParams === null) {
        searchParams = ""
    }

    const allClusterTitles: {
        href: string,
        name: string,
        color: string
    }[] = []

    Object.entries(ascensionsData).map(([aspect, ascData]) => {
        const title_text_color = aspectToTextCSS(aspect)

        ascData.forEach((clusterData) => {
            const titleInSearch = clusterData.name.toLowerCase().includes(searchParams.toLowerCase()) || searchParams !== ""

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
                        <Link
                            key={"sidebar" + cluster.name}
                            href={cluster.href}
                            className="block w-full h-full text-left text-[18px] py-1 hover:bg-gray-900 hover:cursor-pointer">
                            <div className={`${cluster.color}`}>
                                {cluster.name}
                            </div>
                        </Link>
                    ))
                }
            </div>
        </div>
    );
}
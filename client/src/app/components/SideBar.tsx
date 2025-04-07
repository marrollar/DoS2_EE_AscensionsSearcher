"use client"

import * as cheerio from "cheerio";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AscensionData, Aspect_Txt_Color, stringToAspect } from "../types";

export default function SideBar({ ascensionsData }: Readonly<{ ascensionsData: AscensionData }>) {
    const usp = useSearchParams();
    let searchParams = usp.get("query")
    if (searchParams === null) {
        searchParams = ""
    }

    const allClusterTitles: { href: string, __html: string }[] = []
    Object.entries(ascensionsData).map(([aspect, ascData]) => {
        const asp = stringToAspect[aspect]

        ascData.forEach((clusterData) => {
            const clusterTitle = clusterData.title
            const $title = cheerio.load(clusterTitle)
            $title("font").attr("color", Aspect_Txt_Color[asp].slice(1))

            const titleInSearch = $title.text().toLowerCase().includes(searchParams.toLowerCase()) || searchParams !== ""

            if (titleInSearch) {
                allClusterTitles.push({
                    href: "#" + $title.text().replaceAll(" ", ""),
                    __html: $title.html()
                })
            }
        })
    })

    return (
        <div className={`fixed w-[10%] p-1 min-w-[200px] translate-x-[calc(-100%-8px)] translate-y-[-4px] h-[50%] bg-gray-700 rounded-lg overflow-scroll`}>
            <div className="bg-gray-800 px-1 rounded-lg ">
                <p className="text-2xl py-3">Clusters</p>
                <hr className="border-t border-gray-300/25" />
                {
                    allClusterTitles.map((cluster) => (
                        <Link
                            key={"sidebar" + cluster.__html}
                            href={cluster.href}
                            className="block w-full h-full text-left text-[18px] px-2 py-1 hover:bg-gray-900 hover:cursor-pointer">
                            <div dangerouslySetInnerHTML={{ __html: cluster.__html }} />
                        </Link>
                    ))
                }
            </div>
        </div>
    );
}
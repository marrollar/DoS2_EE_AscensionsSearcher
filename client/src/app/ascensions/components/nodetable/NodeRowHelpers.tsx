import { ISubNode } from "@/app/types";
import * as cheerio from "cheerio";
import { useContext } from "react";
import { ClusterCtx } from "../clusterbox/ClusterBox";
import { useQueryState } from "nuqs";

export function MainNodeDivider({ name, __html }: Readonly<{ name: string, __html: string }>) {

    const [searchQuery] = useQueryState("query", { defaultValue: "" })

    const clusterCtx = useContext(ClusterCtx);

    const hasSearchString = cheerio.load(__html).text().toLowerCase().includes(searchQuery)
    const titleIsSearch = clusterCtx.clusterName.toLowerCase().includes(searchQuery)

    return (
        <td className="w-1/4 px-4 py-2 border border-gray-500 text-center align-top">
            {name}
            <hr className="border-t border-gray-300/25" />
            <div className={`${!hasSearchString && !titleIsSearch ? "opacity-25" : ""}`} dangerouslySetInnerHTML={{ __html: __html }} />
        </td>
    )
}

export function SubNodesDivider({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <td className="w-3/4 border border-gray-500">
            <table className="w-[100%] border-collapse">
                <tbody>
                    <tr>
                        <td className="w-[50%] px-2 py-1  border-r border-gray-500 align-top " > <br /></td>
                        <td className="w-[50%] px-2 py-1  border-gray-500 align-top" />
                    </tr>
                    {children}
                </tbody>
            </table>
        </td>
    )
}

export function SubNodeRow({ subNodes, isFirst }: Readonly<{
    subNodes: ISubNode,
    isFirst: boolean
}>) {

    const [searchQuery] = useQueryState("query", { defaultValue: "" })

    const clusterCtx = useContext(ClusterCtx);

    const ogHasSearchString = cheerio.load(subNodes.original).text().toLowerCase().includes(searchQuery)

    let derpysHasSearchString = false
    if (subNodes.derpys) {
        derpysHasSearchString = cheerio.load(subNodes.derpys).text().toLowerCase().includes(searchQuery)
    }

    const titleIsSearch = clusterCtx.clusterName.toLowerCase().includes(searchQuery)

    return (
        <>
            <td className={`w-[50%] px-2 py-1 ${isFirst ? "" : "border-t"} border-r border-gray-500 align-top ${!ogHasSearchString && !titleIsSearch ? "opacity-25" : ""}`} dangerouslySetInnerHTML={{ __html: subNodes.original }} />
            {
                subNodes.derpys ? (
                    <td className={`w-[50%] px-2 py-1 ${isFirst ? "" : "border-t"} border-gray-500 align-top ${!derpysHasSearchString && !titleIsSearch ? "opacity-25" : ""}`} dangerouslySetInnerHTML={{ __html: subNodes.derpys }} />
                ) : (
                    <td className={`w-[50%] px-2 py-1 ${isFirst ? "" : "border-t"} border-gray-500 align-top`} />
                )
            }
        </>
    )
}
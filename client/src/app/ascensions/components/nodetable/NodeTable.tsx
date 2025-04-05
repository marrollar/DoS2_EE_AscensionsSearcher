import * as cheerio from "cheerio";
import { useSearchParams } from "next/navigation";
import { useContext } from "react";
import { ISubNode } from "../../page";
import { ClusterCtx } from "../clusterbox/ClusterBox";

export function MainNodeDivider({ name, __html }: Readonly<{ name: string, __html: string }>) {
    const clusterCtx = useContext(ClusterCtx);

    const searchParams = useSearchParams();
    const searchString = searchParams.get("query")?.toString().toLowerCase()

    const $html = cheerio.load(__html)
    const hasSearchString = $html.text().toLowerCase().includes(searchString ? searchString : "")

    const $cName = cheerio.load(clusterCtx.clusterName)
    const titleIsSearch = $cName.text().toLowerCase().includes(searchString ? searchString : "")

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

export function SubNodeRow({ subNodes, isFirst }: Readonly<{ subNodes: ISubNode, isFirst: boolean }>) {
    const clusterCtx = useContext(ClusterCtx);

    const searchParams = useSearchParams();
    const searchString = searchParams.get("query")?.toString().toLowerCase()

    const $og = cheerio.load(subNodes.original)
    const ogHasSearchString = $og.text().toLowerCase().includes(searchString ? searchString : "")

    let derpysHasSearchString = true
    if (subNodes.derpys) {
        const $derpys = cheerio.load(subNodes.derpys)
        derpysHasSearchString = $derpys.text().toLowerCase().includes(searchString ? searchString : "")
    }

    const $cName = cheerio.load(clusterCtx.clusterName)
    const titleIsSearch = $cName.text().toLowerCase().includes(searchString ? searchString : "")

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
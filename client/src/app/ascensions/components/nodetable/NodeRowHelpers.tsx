import { ISubNode } from "@/app/types";
import * as cheerio from "cheerio";
import { useQueryState } from "nuqs";
import { useContext } from "react";
import { ClusterCtx } from "../clusterbox/ClusterBox";
import { KeyWordsCtx } from "@/app/components/KeywordsContext";
import KeyWord from "@/app/components/Keyword";

export function MainNodeDivider({ name, __html }: Readonly<{ name: string, __html: string }>) {

    const [searchQuery] = useQueryState("query", { defaultValue: "" })
    const lowerQuery = searchQuery.toLowerCase()

    const clusterCtx = useContext(ClusterCtx);
    const keywordsCtx = useContext(KeyWordsCtx)

    const hasSearchString = cheerio.load(__html).text().toLowerCase().includes(lowerQuery)
    const titleIsSearch = clusterCtx.clusterName.toLowerCase().includes(lowerQuery)

    const all_keywords = new Set(Object.keys(keywordsCtx))
    all_keywords.add("Violent Strike")
    all_keywords.add("Withered")
    all_keywords.delete("Wither")
    const keywords_regexp = new RegExp(`(${[...all_keywords].join('|')})`, 'gi')

    const tokens = __html.split(keywords_regexp)

    return (
        <td className="w-1/4 px-4 py-2 border border-gray-500 text-center align-top">
            {name}
            <hr className="border-t border-gray-300/25" />
            <div className={`${!hasSearchString && !titleIsSearch ? "opacity-25" : ""}`}>
                {
                    tokens.map((e, index) => {
                        const isKeyword = all_keywords.has(e)
                        return isKeyword ? (
                            <KeyWord key={index} keyword={e} />
                        ) : (
                            <span key={index} dangerouslySetInnerHTML={{ __html: e }} />
                        )
                    })
                }
            </div>
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
    const lowerQuery = searchQuery.toLowerCase()

    const clusterCtx = useContext(ClusterCtx);
    const keywordsCtx = useContext(KeyWordsCtx)

    const origCheerio = cheerio.load(subNodes.original)
    const ogHasSearchString = origCheerio.text().toLowerCase().includes(lowerQuery)

    let derpysCheerio = null
    let derpysHasSearchString = false
    if (subNodes.derpys) {
        derpysCheerio = cheerio.load(subNodes.derpys)
        derpysHasSearchString = derpysCheerio.text().toLowerCase().includes(lowerQuery)
    }

    const titleIsSearch = clusterCtx.clusterName.toLowerCase().includes(lowerQuery)

    const all_keywords = new Set(Object.keys(keywordsCtx))
    all_keywords.add("Violent Strike")
    all_keywords.add("Withered")
    all_keywords.delete("Wither")
    const keywords_regexp = new RegExp(`(${[...all_keywords].join('|')})`, 'gi')

    const orig_tokens = subNodes.original.split(keywords_regexp)
    const derpys_tokens = subNodes.derpys?.split(keywords_regexp)

    // TODO: Maybe try to optimize this somehow? 
    // Technically there is only the case that the 0th index of the tokens is relevant, so this is way overengineered...
    for (let i = 0; i < orig_tokens.length; i++) {
        if (orig_tokens[i].includes("activate Finesse's AP recovery effect")) {
            const desc = orig_tokens[i]
            const prefixLoc = desc.indexOf("Aerotheurge")
            orig_tokens[i] = desc.slice(0, prefixLoc) + "Spellcaster's Finesse: <br>" + desc.slice(prefixLoc)
        }
    }

    if (derpys_tokens) {
        for (let i = 0; i < derpys_tokens.length; i++) {
            if (derpys_tokens[i].includes("activate Finesse's AP recovery effect")) {
                const desc = derpys_tokens[i]
                const prefixLoc = desc.indexOf("Aerotheurge")
                derpys_tokens[i] = desc.slice(0, prefixLoc) + "Spellcaster's Finesse: <br>" + desc.slice(prefixLoc)
            }
        }
    }

    return (
        <>
            <td className={`w-[50%] px-2 py-1 ${isFirst ? "" : "border-t"} border-r border-gray-500 align-top ${!ogHasSearchString && !titleIsSearch ? "opacity-25" : ""}`}>
                {
                    orig_tokens.map((e, index) => {
                        const isKeyword = all_keywords.has(e)
                        return isKeyword ? (
                            <KeyWord key={index} keyword={e} />
                        ) : (
                            <span key={index} dangerouslySetInnerHTML={{ __html: e }} />
                        )
                    })
                }
            </td>
            {
                subNodes.derpys ? (
                    <td className={`w-[50%] px-2 py-1 ${isFirst ? "" : "border-t"} border-gray-500 align-top ${!derpysHasSearchString && !titleIsSearch ? "opacity-25" : ""}`}>
                        {
                            derpys_tokens?.map((e, index) => {
                                const isKeyword = all_keywords.has(e)
                                return isKeyword ? (
                                    <KeyWord key={index} keyword={e} />
                                ) : (
                                    <span key={index} dangerouslySetInnerHTML={{ __html: e }} />
                                )
                            })
                        }
                    </td>
                ) : (
                    <td className={`w-[50%] px-2 py-1 ${isFirst ? "" : "border-t"} border-gray-500 align-top`} />
                )
            }
        </>
    )
}
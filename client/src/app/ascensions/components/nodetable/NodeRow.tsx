import { MainNodeDivider, SubNodeRow, SubNodesDivider } from "@/app/ascensions/components/nodetable/NodeTable";
import { ISubNode } from "@/app/types";
import * as cheerio from "cheerio";
import { useContext } from "react";
import { ClusterCtx } from "../clusterbox/ClusterBox";

export default function NodeRow({ searchParams, mainNode, subNodes, implicit }:
    Readonly<{
        searchParams: string,
        mainNode: string,
        subNodes: { [key: string]: ISubNode },
        implicit: string
    }>) {

    const clusterCtx = useContext(ClusterCtx)
    const parentKey = clusterCtx.aspect + clusterCtx.clusterName + clusterCtx.mainNodeID

    let implicitClean = ""
    if (implicit.length > 0) {
        const $ = cheerio.load(implicit)

        const implicitClean_tokens = $.text()
            .replace(/\s+/g, ' ')
            .trim()
            .split("Additionally, you may choose from:")[0]
            .replace("Gain: ", "")
            .split(">")
        implicitClean = '<font color="cb9780">></font> ' + implicitClean_tokens[1]
        implicitClean_tokens.slice(2).forEach(element => {
            implicitClean = implicitClean + '<br><font color="cb9780">></font> ' + element
        });
    }

    return (
        <div className="overflow-x-auto px-4">
            <table className="w-[100%] table-fixed border-collapse">
                <tbody>
                    <tr className={parseInt(mainNode) % 2 == 0 ? "bg-gray-700" : "bg-gray-800"}>
                        <MainNodeDivider searchParams={searchParams} name={mainNode} __html={implicitClean} />
                        <SubNodesDivider>
                            {Object.keys(subNodes).map((subNodeID) => {

                                const parentColorId = parseInt(mainNode) % 2
                                let myColorId = parseInt(subNodeID) % 2 == 0

                                if (parentColorId == 0) {
                                    myColorId = !myColorId
                                }

                                return (
                                    <tr key={parentKey + subNodeID} className={`${myColorId ? "bg-gray-800" : "bg-gray-700"}`}>
                                        <SubNodeRow searchParams={searchParams} subNodes={subNodes[subNodeID]} isFirst={subNodeID === "0"} />
                                    </tr>
                                )
                            })}
                        </SubNodesDivider>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
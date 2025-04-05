import { SubNodesDivider, MainNodeDivider, SubNodeRow } from "@/app/ascensions/components/nodetable/NodeTable";
import { ISubNode } from "@/app/ascensions/page";
import * as cheerio from "cheerio";
import { useContext } from "react";
import { ClusterContext } from "../clusterbox/ClusterBox";

export default function NodeRow({ mainNode, subNodes, implicit }:
    Readonly<{
        mainNode: string,
        subNodes: { [key: string]: ISubNode },
        implicit: string
    }>) {

    const clusterCtx = useContext(ClusterContext)

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
                        <MainNodeDivider name={mainNode} __html={implicitClean} />
                        <SubNodesDivider>
                            {Object.keys(subNodes).map((subNodeID) => {

                                const parentColorId = parseInt(mainNode) % 2
                                let myColorId = parseInt(subNodeID) % 2 == 0

                                if (parentColorId == 0) {
                                    myColorId = !myColorId
                                }

                                return (
                                    <tr key={clusterCtx + subNodeID} className={`${myColorId ? "bg-gray-800" : "bg-gray-700"}`}>
                                        <SubNodeRow subNodes={subNodes[subNodeID]} isFirst={subNodeID === "0"} />
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
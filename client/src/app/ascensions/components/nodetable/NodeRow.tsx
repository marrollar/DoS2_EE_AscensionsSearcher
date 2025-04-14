import { MainNodeDivider, SubNodeRow, SubNodesDivider } from "@/app/ascensions/components/nodetable/NodeRowHelpers";
import { ISubNode } from "@/app/types";
import * as cheerio from "cheerio";
import { useContext } from "react";
import { AspectContext } from "../../client-page";
import { ClusterCtx } from "../clusterbox/ClusterBox";

export default function NodeRow({ subNodes, implicit }:
    Readonly<{
        subNodes: { [key: string]: ISubNode },
        implicit: string
    }>) {

    const aspect = useContext(AspectContext)
    const clusterCtx = useContext(ClusterCtx)

    const parentKey = aspect + clusterCtx.clusterName + clusterCtx.mainNodeID
    const mainNID = parseInt(clusterCtx.mainNodeID, 10)

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
                    <tr className={mainNID % 2 == 0 ? "bg-base-300" : "bg-base-100"}>
                        <MainNodeDivider name={clusterCtx.mainNodeID} __html={implicitClean} />
                        <SubNodesDivider>
                            {Object.keys(subNodes).map((subNodeID) => {

                                const parentColorId = mainNID % 2
                                let myColorId = parseInt(subNodeID) % 2 == 0

                                if (parentColorId == 0) {
                                    myColorId = !myColorId
                                }

                                return (
                                    <tr key={parentKey + subNodeID} className={`${myColorId ? "bg-base-100" : "bg-base-300"}`}>
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
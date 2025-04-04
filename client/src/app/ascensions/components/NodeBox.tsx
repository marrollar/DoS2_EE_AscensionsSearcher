import { NodeColLarge, NodeColSmall } from "@/app/ascensions/components/NodeTable";
import { ISubNode } from "@/app/ascensions/page";
import * as cheerio from "cheerio";

export default function NodeBox({ parentKey, mainNode, subNodes, implicit }:
    Readonly<{
        parentKey: string,
        mainNode: string,
        subNodes: { [key: string]: ISubNode },
        implicit: string
    }>) {

    let implicitClean = ""
    if (implicit.length > 0) {
        const $ = cheerio.load(implicit)
        console.log($.text())

        implicitClean = $.text().split(".")[0].replace("Gain:  > ", "")
    }

    return (
        <div className="overflow-x-auto px-4">
            <table className="w-[100%] table-fixed border-collapse">
                <tbody>
                    <tr className={parseInt(mainNode) % 2 == 0 ? "bg-gray-700" : "bg-gray-800"}>
                        <NodeColSmall>
                            {mainNode}
                            <hr className="border-t border-gray-300/25" />
                            {implicitClean}
                        </NodeColSmall>
                        <NodeColLarge>
                            {Object.keys(subNodes).map((key) => {

                                const original = subNodes[key].original
                                const derpys = subNodes[key].derpys
                                // TODO: Implement derpys changes

                                const original_tokens = original.split("<br>")

                                return (
                                    <div key={parentKey + key}>
                                        <div dangerouslySetInnerHTML={{ __html: original_tokens[0] }} />
                                        {
                                            original_tokens.slice(1).map((e) => (
                                                <div key={parentKey + key + e + "original"} dangerouslySetInnerHTML={{ __html: e }} className="pl-4" />
                                            ))
                                        }
                                    </div>
                                )
                            })}
                        </NodeColLarge>
                    </tr>

                </tbody>
            </table>
        </div>
    )
}
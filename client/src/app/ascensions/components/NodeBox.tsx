import { NodeColLarge, NodeColSmall, SubNodeRow } from "@/app/ascensions/components/NodeTable";
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
                        <NodeColSmall>
                            {mainNode}
                            <hr className="border-t border-gray-300/25" />
                            <div dangerouslySetInnerHTML={{ __html: implicitClean }} />
                        </NodeColSmall>
                        <NodeColLarge>
                            <table className="w-[100%] border-collapse">
                                <tbody>
                                    {Object.keys(subNodes).map((key) => {

                                        const parentColorId = parseInt(mainNode) % 2
                                        let myColorId = parseInt(key) % 2 == 0

                                        if (parentColorId == 0) {
                                            myColorId = !myColorId
                                        }

                                        return (
                                            <tr key={parentKey + key} className={`${myColorId ? "bg-gray-800" : "bg-gray-700"}`}>
                                                <SubNodeRow subNodes={subNodes[key]} isFirst={key === "0"} />
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </NodeColLarge>
                    </tr>

                </tbody>
            </table>
        </div>
    )
}
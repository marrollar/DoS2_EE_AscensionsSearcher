import { ISubNodeData } from "@/app/ascensions/page";
import table_styles from "./AspectColors.module.css";
import { NodeColLarge, NodeColSmall } from "@/app/ascensions/components/NodeTable";
import React from "react";
import * as cheerio from "cheerio"


export default function NodeBox({ parentKey, mainNode, subNodes }:
    Readonly<{
        parentKey: string,
        mainNode: string,
        subNodes: { [key: string]: ISubNodeData }
    }>) {

    const data = [
        {
            left: "Row 1",
            right: ["Sub-row 1", "Sub-row 2", "Sub-row 3", "Sub-row 4"],
        },
        {
            left: "Row 2",
            right: ["Sub-row 1", "Sub-row 2", "Sub-row 3", "Sub-row 4"],
        },
        {
            left: "Row 3",
            right: ["Sub-row 1", "Sub-row 2", "Sub-row 3", "Sub-row 4"],
        },
        {
            left: "Row 4",
            right: ["Sub-row 1", "Sub-row 2", "Sub-row 3", "Sub-row 4"],
        },
    ];


    return (
        // <div className="flex w-[100%]">
        //     <div className="w-1/4 text-center">
        //         test
        //     </div>
        //     <div className="w-3/4 text-left">
        //         test
        //     </div>
        // </div>


        // <div className="overflow-x-auto">
        //   <table className="w-[100%] table-fixed border-collapse">
        //     {/* <thead>
        //       <tr className="bg-gray-800">
        //         <NodeColSmall>Name</NodeColSmall>
        //         <NodeColLarge>Description</NodeColLarge>
        //       </tr>
        //     </thead> */}
        //     <tbody>
        //       <tr className="bg-gray-700">
        //         <NodeColSmall>Alice</NodeColSmall>
        //         <NodeColLarge>A web developer based in New York.</NodeColLarge>
        //       </tr>
        //       <tr className="bg-gray-800">
        //         <NodeColSmall>Bob</NodeColSmall>
        //         <NodeColLarge>A software engineer located in San Francisco.</NodeColLarge>
        //       </tr>
        //       <tr className="bg-gray-700">
        //         <NodeColSmall>Charlie</NodeColSmall>
        //         <NodeColLarge>A product manager from Chicago.</NodeColLarge>
        //       </tr>
        //     </tbody>
        //   </table>
        // </div>

        <div className="overflow-x-auto px-4">
            <table className="w-[100%] table-fixed border-collapse">
                <tbody>
                    <tr className={parseInt(mainNode) % 2 == 0 ? "bg-gray-700" : "bg-gray-800"}>
                        <NodeColSmall>{mainNode}</NodeColSmall>
                        <NodeColLarge>
                            {Object.keys(subNodes).map((key) => {

                                const original = subNodes[key].original
                                const derpys = subNodes[key].derpys

                                // const original_cheerio = cheerio.load(original)
                                // original_cheerio("font:first").remove()
                                // original_cheerio("br").remove()
                                // // original_html("font:first").remove()
                                // original_cheerio("font").removeAttr("size").removeAttr("face")
                                // original_cheerio("font:first").nextAll().each((_, element) => {
                                //     const text = original_cheerio(element).text()
                                //     if (text === ">") {
                                //         const tokens = text.split(">")
                                //         const before = tokens[0]
                                //         const after = tokens[1]

                                //         const updatedHTML = before + "<br>\t>" + after
                                //         original_cheerio(element).html(updatedHTML)
                                //     }
                                // })
                                // // original_html =
                                // const original_html = original_cheerio("p").html()

                                // // console.log(original_cheerio("p").html())
                                // // console.log(original_html)

                                // // console.log(original_cheerio("p").html())

                                // const tmp = original.split("&gt;")
                                // console.log(tmp)

                                const original_tokens = original.split("<br>")
                                // console.log(parentKey+key)

                                return (
                                    <div key={parentKey + key}>
                                        <div dangerouslySetInnerHTML={{ __html: original_tokens[0] }} />
                                        {
                                            original_tokens.slice(1).map((e) => (
                                                <div key={parentKey + key + e} dangerouslySetInnerHTML={{ __html: e }} className="pl-4" />
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


        // <div className="overflow-x-auto p-4">
        //   <table className="min-w-full table-auto border-collapse">
        //     <thead>
        //       <tr>
        //         <th className="w-1/4 px-4 py-2 border">Left Column</th>
        //         <th className="w-3/4 px-4 py-2 border">Right Column</th>
        //       </tr>
        //     </thead>
        //     <tbody>
        //       {data.map((item, index) => (
        //         <React.Fragment key={index}>
        //           <tr className="bg-gray-700">
        //             <td className="w-1/4 px-4 py-2 border ">{item.left}</td>
        //             <td className="w-3/4 px-4 py-2 border">
        //               {/* Render sub-rows in the right column */}
        //               <ul className="space-y-2">
        //                 {item.right.map((subItem, subIndex) => (
        //                   <li key={subIndex} className="pl-4">{subItem}</li>
        //                 ))}
        //               </ul>
        //             </td>
        //           </tr>
        //         </React.Fragment>
        //       ))}
        //     </tbody>
        //   </table>
        // </div>
    )
}
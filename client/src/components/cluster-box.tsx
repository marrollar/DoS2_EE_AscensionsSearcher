import { IClusterData } from "@/app/ascensions/page"
import * as cheerio from "cheerio"

export default function ClusterBox({ cluster }: Readonly<{ cluster: IClusterData }>) {
    const cluster_Name = cluster.title
    const cluster_MainDescription = cluster.description
    const cluster_Nodes = cluster.nodes
    const cluster_RequirementsAndRewards = cluster.rewards

    const name_html = cheerio.load(cluster_Name)
    const reqRew_html = cheerio.load(cluster_RequirementsAndRewards)

    const title_text = name_html.text()
    const title_color = "#" + name_html("font").attr("color")

    const description_text = cluster_MainDescription.slice(0, cluster_MainDescription.indexOf("<br>"))

    reqRew_html("font").replaceWith(function () {
        const newTag = reqRew_html("<span>").text(reqRew_html(this).text())
        const fontColor = reqRew_html(this).attr("color")

        newTag.attr("style", `color:#${fontColor}`)

        return newTag
    })

    const reqRew_raw = reqRew_html("body").html();
    let reqRew_parts = null
    if (reqRew_raw !== null) {
        reqRew_parts = reqRew_raw.split(".")
        reqRew_parts[0] = reqRew_parts[0].replace("Requires:", "Required:")
        reqRew_parts[1] = reqRew_parts[1].replaceAll("<br>", "").replace("Completion grants:", "Completion:")
    }

    console.log(reqRew_parts)
    console.log(reqRew_parts[0] + " " + reqRew_parts[1])

    return (
        <div className="bg-[#202020] mt-1 px-2">
            <div className="text-center" style={{ color: title_color, fontSize: 28 }}>
                {title_text}
            </div>
            <div className="text-center">
                {description_text}
            </div>
            {
                reqRew_parts ? (
                    <div className="flex w-[100%] mt-4">
                        <div className="w-1/2 text-center">
                            <div dangerouslySetInnerHTML={{ __html: reqRew_parts[0] }} />
                        </div>
                        <div className="w-1/2 text-center">
                            <div dangerouslySetInnerHTML={{ __html: reqRew_parts[1] }} />
                        </div>
                    </div>
                ) : (
                    <div> Error while trying to format requirements and rewards HTML. </div>
                )
            }
        </div>
    )
}
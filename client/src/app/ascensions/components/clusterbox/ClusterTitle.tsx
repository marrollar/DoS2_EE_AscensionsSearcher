import { aspectToTextCSS } from "@/app/utils"
import { useContext } from "react"
import { AspectContext } from "../../client-page"

export default function ClusterTitle({ clusterName }: Readonly<{ clusterName: string }>) {
    const aspect = useContext(AspectContext)
    const title_text_color = aspectToTextCSS(aspect)

    return (
        <div className={`text-center text-[24px] ${title_text_color}`}>
            {clusterName}
        </div>
    )

}
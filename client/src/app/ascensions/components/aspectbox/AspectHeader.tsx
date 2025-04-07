import { aspectToBGCSS } from "@/app/utils"
import { useContext } from "react"
import { AspectContext } from "../../client-page"

export default function AspectHeader({ children }: Readonly<{ children: React.ReactNode }>) {
    const aspect = useContext(AspectContext)
    const header_BG_Color = aspectToBGCSS(aspect)

    return (
        <div className={`w-[100%] mb-1 px-2 pb-2 rounded-lg ${header_BG_Color}`}>
            <p className="text-2xl py-3">
                {aspect}
            </p>
            <hr className="border-t border-gray-300/25" />
            {children}
        </div>
    )
}
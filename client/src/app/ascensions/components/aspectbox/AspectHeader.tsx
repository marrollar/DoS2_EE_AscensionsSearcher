import { Aspects } from "@/types"
import { useContext } from "react"
import { AspectContext } from "../../client-page"
import styles from "./AspectColors.module.css"

export default function AspectHeader({ children }: Readonly<{ children: React.ReactNode }>) {
    const aspect = useContext(AspectContext)
    const header_BG_Color = (
        aspect === Aspects.Force ? styles.force_bg_color :
            aspect === Aspects.Life ? styles.life_bg_color :
                aspect === Aspects.Entropy ? styles.entropy_bg_color :
                    aspect === Aspects.Form ? styles.form_bg_color :
                        aspect === Aspects.Inertia ? styles.inertia_bg_color : ""
    )

    return (
        <div className={`w-[100%] my-1 px-2 pb-2 ${header_BG_Color}`}>
            <p className="text-2xl py-3">
                {aspect}
            </p>
            <hr className="border-t border-gray-300/25" />
            {children}
        </div>
    )
}
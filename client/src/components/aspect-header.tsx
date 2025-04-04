import { Aspects } from "@/types"
import styles from "./AspectColors.module.css"

export default function AspectHeader({ aspect, children }: Readonly<{ aspect: string, children: React.ReactNode }>) {
    return (
        <div className={`w-[100%] my-1 px-2 py-2 
            ${aspect === Aspects.Force ? styles.force_bg_color :
                aspect === Aspects.Life ? styles.life_bg_color :
                    aspect === Aspects.Entropy ? styles.entropy_bg_color :
                        aspect === Aspects.Form ? styles.form_bg_color :
                            aspect === Aspects.Inertia ? styles.inertia_bg_color : ""
            }`}>
            <p className="text-2xl">
                {aspect}
            </p>
            <hr className="border-t border-gray-300/25" />
            {children}
        </div>
    )
}
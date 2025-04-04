import { Aspects } from "@/types"
import styles from "./AspectColors.module.css"

export default function AspectHeader({ aspect }: Readonly<{ aspect: string }>) {
    return (
        <div className={`w-[100%] my-1 px-2 py-2 
            ${aspect === Aspects.Force ? styles.force_color :
                aspect === Aspects.Life ? styles.life_color :
                    aspect === Aspects.Entropy ? styles.entropy_color :
                        aspect === Aspects.Form ? styles.form_color :
                            aspect === Aspects.Inertia ? styles.inertia_color : ""
            }`}>
            <p className="text-2xl">
                {aspect}
            </p>
            <hr className="border-t border-gray-300/25 " />
        </div>
    )
}
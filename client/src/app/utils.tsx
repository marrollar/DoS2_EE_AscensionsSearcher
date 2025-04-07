import { Aspects } from "./types";
import styles from "@/app/ascensions/components/aspectbox/AspectColors.module.css"

export function aspectToTextCSS(aspect: string) {
    return aspect === Aspects.Force ? styles.force_text_color :
        aspect === Aspects.Life ? styles.life_text_color :
            aspect === Aspects.Entropy ? styles.entropy_text_color :
                aspect === Aspects.Form ? styles.form_text_color :
                    aspect === Aspects.Inertia ? styles.inertia_text_color : ""
}

export function aspectToBGCSS(aspect: string) {
    return aspect === Aspects.Force ? styles.force_bg_color :
        aspect === Aspects.Life ? styles.life_bg_color :
            aspect === Aspects.Entropy ? styles.entropy_bg_color :
                aspect === Aspects.Form ? styles.form_bg_color :
                    aspect === Aspects.Inertia ? styles.inertia_bg_color : ""
}
import { Artifact_Txt_Color } from "@/app/types";

export default function ArtifactsTitle({ name }: Readonly<{ name: string }>) {
    return (
        <div className="text-center text-[24px]" style={{ color: Artifact_Txt_Color }}>
            {name}
        </div >
    )
}
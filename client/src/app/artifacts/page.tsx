import { getArtifacts } from "../db/queries"
import ArtifactsBox from "./components/ArtifactsBox"

export default async function ArtifactsHome() {
    const artifactsData = await getArtifacts()

    return (
        <div className="flex flex-col max-w-[1050] mx-auto my-2 px-1 py-1 rounded bg-base-200 border border-base-300">
            {
                artifactsData.map((e) => {
                    return (
                        <ArtifactsBox key={e.aname} name={e.aname} orig={e.orig} derpys={e.derpys} icon={e.icon} />
                    )
                })
            }
        </div>
    )
}
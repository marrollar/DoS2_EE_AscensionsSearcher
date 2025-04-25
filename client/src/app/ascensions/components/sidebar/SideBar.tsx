import { Suspense } from "react";
import { AscensionData } from "../../../types";
import SideBarAscensionsContent from "./SideBarAscensionsContent";
import SideBarAscensionsContentSkeleton from "@/app/skeletons/SideBarAscensionsContentSkeleton";

export default function SideBar({ ascensionsData }: Readonly<{ ascensionsData: AscensionData }>) {
    return (
        <div className={`fixed max-w-[210px] h-[75%] p-1 translate-x-[calc(-100%-8px)] translate-y-[-4px] bg-base-100 rounded overflow-y-scroll`}>
            <div className="bg-base-200 px-2 pb-2 rounded ">
                <Suspense fallback={<SideBarAscensionsContentSkeleton />}>
                    <SideBarAscensionsContent ascensionsData={ascensionsData} />
                </Suspense>
            </div>
        </div>
    );
}
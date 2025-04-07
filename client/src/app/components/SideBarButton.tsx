"use client"
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";


export default function SideBarButton({ clusterName, color }: Readonly<{ clusterName: string, color: string }>) {
    const [searchQuery] = useQueryState("query", { defaultValue: "" })
    const [isHidden, setIsHidden] = useState(false);

    const href = clusterName.replaceAll(" ", "")

    useEffect(() => {
        const element = document.getElementById(href) as HTMLElement;
        const clusterIsHidden = element.getAttribute("class")?.includes("hidden")

        if (clusterIsHidden) {
            setIsHidden(true)
        } else {
            setIsHidden(false)
        }

    }, [searchQuery, href])


    const scrollToCluster = () => {
        const element = document.getElementById(href) as HTMLElement;
        if (!element) return;

        element.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
        });
    };

    return (
        <>
            <button
                onClick={scrollToCluster}
                className={`block w-full h-full text-left text-[18px] py-1 hover:bg-gray-900 hover:cursor-pointer ${color} ${isHidden ? "hidden" : ""}`}>
                {clusterName}
            </button>
        </>
    )
}
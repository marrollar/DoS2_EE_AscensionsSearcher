"use client"
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";

export default function SideBarButton({
    clusterName,
    sideBarSearch,
    color
}: Readonly<{
    clusterName: string,
    sideBarSearch: string,
    color: string
}>) {
    const [searchQuery] = useQueryState("query", { defaultValue: "" })
    const [isHidden, setIsHidden] = useState(false);

    const href = clusterName.replaceAll(" ", "")

    useEffect(() => {
        const element = document.getElementById(href) as HTMLElement;
        const clusterIsHidden = element.getAttribute("class")?.includes("hidden")
        const clusterInSideSearch = clusterName.toLowerCase().includes(sideBarSearch.toLowerCase())

        const buttonIsHidden = clusterIsHidden || !clusterInSideSearch

        if (buttonIsHidden) {
            setIsHidden(true)
        } else {
            setIsHidden(false)
        }

    }, [searchQuery, href, clusterName, sideBarSearch])


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
                className={`btn justify-start w-full bg-base-100 hover:bg-base-300 hover:cursor-pointer ${color} ${isHidden ? "hidden" : ""}`}
            >
                {clusterName}
            </button>
        </>
    )
}
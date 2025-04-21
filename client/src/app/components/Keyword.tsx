"use client"

import { useContext, useState } from "react"
import { KeyWordsCtx } from "./KeywordsContext"

export default function KeyWord({
    keyword
}: Readonly<{
    keyword: string
}>) {

    if (keyword === "Withered") {
        keyword = "Wither"
    }
    if (keyword === "Violent Strike") {
        keyword = "Violent Strikes"
    }

    const keywordsCtx = useContext(KeyWordsCtx)
    const [isOpen, setIsOpen] = useState(false)

    const handleClick = () => {
        setIsOpen(!isOpen)
    }
    const handleMouseLeave = () => {
        setIsOpen(false)
    }

    const orig_desc = keywordsCtx[keyword].orig
    const derpys_desc = keywordsCtx[keyword].derpys

    return (
        <span
            style={{ color: "#ebc808" }}
            onMouseLeave={handleMouseLeave}
            className={`relative ${isOpen ? "tooltip tooltip-bottom" : ""}`}
        >
            <button
                className="hover:cursor-pointer hover:underline"
                onClick={handleClick}
            >
                {keyword}
            </button>
            {
                isOpen && (
                    <div className="absolute tooltip-content">
                        <div className="flex flex-row">
                            <div className="flex-1 border border-base-300 p-2" dangerouslySetInnerHTML={{ __html: orig_desc }} />
                            <div className="flex-1 border border-base-300 p-2" dangerouslySetInnerHTML={{ __html: derpys_desc ? derpys_desc : "" }} />
                        </div>
                    </div>
                )
            }
        </span>
    )
}
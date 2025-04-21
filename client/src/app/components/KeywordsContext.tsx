"use client"

import { createContext } from "react";

type DescsRaw = {
    derpys: string | null;
    keyword: string;
    orig: string;
}[]

type DescsMap = {
    [key: string]: {
        orig: string,
        derpys: string | null
    }
}

export const KeyWordsCtx = createContext<DescsMap>({});

export default function KeyWordsContext({
    kw_descs,
    children
}: Readonly<{
    kw_descs: DescsRaw,
    children: React.ReactNode
}>) {
    const keywordsDict: DescsMap = kw_descs.reduce((ret, e) => {
        const { keyword, ...v } = e
        ret[keyword] = v
        return ret
    }, {} as DescsMap)

    return (
        <KeyWordsCtx.Provider value={keywordsDict}>
            {children}
        </KeyWordsCtx.Provider>
    )
}
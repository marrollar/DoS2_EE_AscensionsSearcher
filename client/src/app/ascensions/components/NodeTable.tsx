import { ISubNode } from "../page"

export function NodeColSmall({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <td className="w-1/4 px-4 py-2 border border-gray-500 text-center align-top">
                {children}
            </td>
        </>
    )
}

export function NodeColLarge({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <td className="w-3/4 border border-gray-500">
                <br />
                {children}
            </td>
        </>
    )
}

export function SubNodeRow({ subNodes, isFirst }: Readonly<{ subNodes: ISubNode, isFirst: boolean }>) {
    // console.log(subNodes)
    return (
        <>
            <td className={`w-[50%] px-2 py-1 ${isFirst ? "" : "border-t"} border-r border-gray-500 align-top`} dangerouslySetInnerHTML={{ __html: subNodes.original }} />
            {
                subNodes.derpys ? (
                    <td className={`w-[50%] px-2 py-1 ${isFirst ? "" : "border-t"} border-gray-500 align-top`} dangerouslySetInnerHTML={{ __html: subNodes.derpys }} />
                ) : (
                    <td className={`w-[50%] px-2 py-1 ${isFirst ? "" : "border-t"} border-gray-500 align-top`} />
                )
            }
        </>
    )
}
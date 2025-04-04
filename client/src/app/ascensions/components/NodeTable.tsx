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
            <td className="w-3/4 px-4 py-2 border border-gray-500">
                <br/>
                {children}
            </td>
        </>
    )
}
export default function ArtifactsTable({ orig, derpys }: Readonly<{ orig: string, derpys: string }>) {
    return (
        <table className="w-full table-fixed border-collapse mt-1">
            <tbody>
                <tr>
                    <td className="w-1/2 bg-base-100 border border-base-300 px-2 py-1 align-top">
                        <div dangerouslySetInnerHTML={{ __html: orig }} />
                    </td>
                    <td className="w-1/2 bg-base-100 border border-base-300 px-2 py-1 align-top">
                        <div dangerouslySetInnerHTML={{ __html: derpys }} />
                    </td>
                </tr>
            </tbody>
        </table>
    )
}
import { ChangeEvent, Dispatch, SetStateAction } from "react"

export default function SidebarSearchBar({
    sideBarSearch,
    setSideBarSearch
}: Readonly<{
    sideBarSearch: string,
    setSideBarSearch: Dispatch<SetStateAction<string>>
}>) {
    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSideBarSearch(e.target.value)
    }

    return (
        <input
            type="text"
            onChange={handleSearchChange}
            className="input w-full border border-gray-300 rounded-sm px-2 py-1 my-2"
            placeholder="Cluster search..."
            defaultValue={sideBarSearch}
        />
    )
}
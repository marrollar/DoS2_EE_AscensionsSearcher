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
        <div className="flex">
            <input
                type="text"
                onChange={handleSearchChange}
                className="input flex-1 border my-4"
                placeholder="Cluster search..."
                defaultValue={sideBarSearch}
            />
        </div>

    )
}
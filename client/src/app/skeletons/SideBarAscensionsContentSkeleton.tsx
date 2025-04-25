export default function SideBarAscensionsContentSkeleton() {
    return (
        <>
            <p className="text-2xl py-3">Clusters</p>
            <hr className="border-t border-gray-300/25" />
            <div className="flex">
                <input
                    type="text"
                    className="input flex-1 border my-4"
                    placeholder="Cluster search..."
                />
            </div>
        </>

    )
}
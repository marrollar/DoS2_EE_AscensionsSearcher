export default function SearchBarSkeleton() {
    return (
        <div className="flex">
            <input
                type="text"
                className="input flex-1 mx-4 my-4"
                placeholder="Keyword search..."
            >
            </input>
        </div>
    )
}
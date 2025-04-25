export default function ArtifactsBoxSkeleton() {
    return (
        <div className="flex flex-col">
            <div className="skeleton place-self-center h-[30] w-[200] m-2 bg-[#a3411448] rounded-none" />
            <hr className="border-t border-base-300" />
            <div className="flex flex-row">
                <div className="skeleton bg-base-200 h-[100] w-[100] m-2 rounded-none"/>
                <div className="skeleton w-full bg-base-200 mt-1 rounded-none"/>
            </div>
        </div>
    )
}
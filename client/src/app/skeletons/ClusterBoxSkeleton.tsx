export default function ClusterBoxSkeleton() {
    return (
        <div className="flex flex-col bg-[#202020] mt-4 px-2 pb-3 h-[1024] rounded-none">
            <div className="skeleton place-self-center h-[36] w-[200] mt-2 bg-[#202020] rounded-none" />
            <div className="skeleton place-self-center h-[24] w-[400] mt-2 bg-[#202020] rounded-none" />
            <div className="flex justify-between w-[100%] my-3">
                <div className="skeleton h-[12] w-1/5 invisible" />
                <div className="skeleton h-[12] w-1/5 bg-[#202020] rounded-none" />
                <div className="skeleton h-[12] w-2/5 invisible" />
                <div className="skeleton h-[12] w-1/5 bg-[#202020] rounded-none" />
                <div className="skeleton h-[12] w-1/5 invisible" />
            </div>
            <div className="px-4 h-[100%]">
                <div className="skeleton h-[100%] bg-[#202020] rounded-none" />
            </div>
        </div>
    )
}
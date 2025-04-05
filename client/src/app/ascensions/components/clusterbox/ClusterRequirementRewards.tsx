export default function ClusterRequirementRewards({ requirements, rewards }: Readonly<{ requirements: string, rewards: string }>) {
    return (
        <div className="flex w-[100%] my-3">
            <div className="w-1/2 text-center">
                <div dangerouslySetInnerHTML={{ __html: requirements }} />
            </div>
            <div className="w-1/2 text-center">
                <div dangerouslySetInnerHTML={{ __html: rewards }} />
            </div>
        </div>
    )

}
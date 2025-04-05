export default function ClusterTitle({ __html }: Readonly<{ __html: string }>) {
    return (
        <div className="text-center text-[24px]" dangerouslySetInnerHTML={{ __html: __html }} />
    )

}

export default function SideBarButton({ clusterName, color }: Readonly<{ clusterName: string, color: string }>) {
    const href = clusterName.replaceAll(" ", "")

    const scrollToCluster = () => {
        const element = document.getElementById(href) as HTMLElement;
        if (!element) return;

        element.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
        });
    };

    return (
        <>
            <button
                onClick={scrollToCluster}
                className={`block w-full h-full text-left text-[18px] py-1 hover:bg-gray-900 hover:cursor-pointer ${color}`}>
                {clusterName}
            </button>
        </>
    )
}
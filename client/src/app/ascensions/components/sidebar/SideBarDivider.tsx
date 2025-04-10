import { aspectToBGCSS } from "@/app/utils"

export default function SideBarDivider({ aspect, children }: Readonly<{ aspect: string, children: React.ReactNode }>) {
    const color = aspectToBGCSS(aspect)

    return (
        <div className={`text-center collapse ${color}`}>
            <input type="checkbox" />
            <div className="collapse-title">
                {aspect}
            </div>
            <div className="collapse-content">
                {children}
            </div>
        </div>
    )
}
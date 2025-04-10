import { AscensionData } from "@/app/types";
import SideBarAscensionsContent from "./SideBarAscensionsContent";
import SideBar from "./SideBar";
import SideDrawerToggleButton from "./SideDrawerToggleButton";

export default function SideDrawer({ ascensionsData }: Readonly<{ ascensionsData: AscensionData }>) {
    return (
        <div className="drawer">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                {/* Page content here */}
                <div className="hidden sxl:block">
                    <SideBar ascensionsData={ascensionsData} />
                </div>
                <div className=" sxl:hidden ">
                    <SideDrawerToggleButton />
                </div>
            </div>
            <div className="drawer-side z-50">
                <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                {/* Sidebar content here */}
                <ul className="menu bg-base-200 text-base-content min-h-full w-50 p-4">
                    <SideBarAscensionsContent ascensionsData={ascensionsData} />
                </ul>
            </div>
        </div>
    )
}
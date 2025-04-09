import NavButton from "./NavButton";

export default function NavBar() {
    return (
        <nav className={`py-2 bg-base-200 rounded transition-all`}>
            <div className={`flex justify-normal items-center`}>
                <NavButton route="/"> Ascensions </NavButton>
                <NavButton route="/artifacts"> Artifacts </NavButton>
            </div>
        </nav >
    );
}
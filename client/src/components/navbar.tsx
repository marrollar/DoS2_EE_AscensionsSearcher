'use client'

import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
    const router = useRouter();
    const current_route = usePathname();

    return (
        <nav className=" py-2 bg-gray-900 rounded-lg shadow-md">
            <div className="flex justify-normal items-center">

                <button
                    className={`text-white px-2 mx-2 hover:underline rounded-lg ${current_route === "/ascensions" ? 'bg-blue-800' : ''}`}
                    onClick={() => router.push("/ascensions")}
                >
                    Ascensions
                </button>

                <button
                    className={`text-white px-2 mx-2 hover:underline rounded-lg ${current_route === "/artifacts" ? 'bg-blue-800' : ''}`}
                    onClick={() => router.push("/artifacts")}>
                    Artifacts
                </button>

            </div>
        </nav >
    );
}
'use client'
import { usePathname, useRouter } from "next/navigation";

export default function NavButton({ route, children }: Readonly<{ route: string, children: React.ReactNode }>) {
    const router = useRouter();
    const current_route = usePathname();

    return (
        <button
            className={`px-2 mx-2 hover:underline rounded hover:cursor-pointer ${current_route === route ? 'bg-primary' : ''}`}
            onClick={() => router.push(route)}
        >
            {children}
        </button>
    )
}
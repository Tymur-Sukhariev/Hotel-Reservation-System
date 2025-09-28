'use client'

import { usePathname, useSearchParams } from "next/navigation";


export function useLinkWithPrevious(to:string){
    const currentPath = usePathname();
    const search =  useSearchParams();
    const newSearch = new URLSearchParams({ previous: currentPath});
    const link = `${to}?previous=${currentPath}`;
    return link;
}
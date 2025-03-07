"use client";

import Link from "next/link";
import styles from '../styles/header.module.css'
import { useState } from "react";
import SideMenu from "./SideMenu";

export default function Header() {

    const [burgerOpen, setButgerOpen] = useState<boolean>(false);

    function handleBurgerClick(){
        setButgerOpen((prev)=>!prev);
    }
    
  return (
    <>
        <SideMenu 
            isOpen={burgerOpen}
            onClose={handleBurgerClick}
        />
         <div className={styles.header}>
             <Link href="/"><h1>HOTEL</h1></Link>

             {!burgerOpen&&     
             <div onClick={handleBurgerClick} className={styles.burger}>
                 <span></span>
             </div>}

         </div>
    </>
  );
}

import Link from "next/link";
import styles from '../styles/sideMenu.module.css'
import { getSession, logoutUser } from "~/server/action";
import { useEffect, useState } from "react"
import { usePathname } from 'next/navigation'

export default function SideMenu({isOpen, onClose}:{isOpen: boolean, onClose: ()=>void}){
    const pathname = usePathname()

    const [isAuth, setIsAuth] = useState(false)

    useEffect(() => {
        getSession().then(session => setIsAuth(!!session))  
    }, [pathname])

    const openSideMenuStyle = isOpen ? styles.open : "";

    function handleCloseMenu(){
        onClose();
    }

    async function handleLogOut(){
        handleCloseMenu()
        await logoutUser();
    }

    return(
        <>
            {isOpen&& <div className={styles.black}></div>}

            <div className={`${openSideMenuStyle} ${styles.sideMenu}`}>
                <div onClick={handleCloseMenu} className={styles.cross}>
                   <span></span>
                   <span></span>
                </div>

                <div className={styles.links}>
                    <Link onClick={handleCloseMenu} href={'/'}>Home</Link>
                    <Link onClick={handleCloseMenu} href={'/my-bookings'}>My Bookings</Link>
                    <Link onClick={handleCloseMenu} href={'/reviews'}>Reviews</Link>
                    {!isAuth?
                    <>
                        <Link onClick={handleCloseMenu} href={'/auth/sign-up'}>Sign Up</Link>
                        <Link onClick={handleCloseMenu} href={'/auth/sign-in'}>Sign In</Link>
                    </>:
                    <button onClick={handleLogOut}>Log Out</button>
                    }           
                </div>
            </div>
        </>
    )
}
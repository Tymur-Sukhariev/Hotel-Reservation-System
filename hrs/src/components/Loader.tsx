'use client'

import styles from '../styles/loader.module.css'
import { useEffect, useRef } from "react"

export default function Loader() {

    const containerRef = useRef<HTMLDivElement>(null)

    function delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }


    useEffect(() => {
        let mounted = true;

        async function animate() {
            const spans = containerRef.current?.querySelectorAll('span');
            if (!spans || spans.length === 0) return;

            let idx = 0;
            let active = true;

            while (mounted) {
                await delay(90);

                if (active) {
                    spans[idx]!.classList.add(`${styles.active}`);
                    spans[idx]!.classList.remove(`${styles.unActive}`);
                } else {
                    spans[idx]!.classList.add(`${styles.unActive}`);
                    spans[idx]!.classList.remove(`${styles.active}`);
                }

                idx = (idx + 1) % spans.length;
                if (idx === 0) active = !active;
            }
        }

        animate();

        return () => { mounted = false }

    }, [])



    return (
        <div ref={containerRef} className={styles.loadingContainer}>
            <span></span>
            <span></span>
            <span></span>
        </div>
    )
}

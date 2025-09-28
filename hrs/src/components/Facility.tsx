import Image from "next/image"
import { FC } from "react"
import styles from '../styles/facility.module.css'
import facilityIcon from '../../public/images/facilityIcon.svg'

const Facility: FC <{facility: string}> = ({facility}) => {
    return(
        <div className={styles.facilityContainer}>
            <p>{facility}</p> 
            <Image
                src={facilityIcon}
                alt="facilityIcon"
            />
        </div>
    )
}

export default Facility
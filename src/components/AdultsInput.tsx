import styles from "../styles/guestsInput.module.css"
import React, { FC,useState} from "react";

type UserInfoType = {
    dates: string[];
    adults: number;
    children: number;
    childrenAges: number[];
  };

const AdultsInput: FC<{userInfo: UserInfoType, setUserInfo: React.Dispatch<React.SetStateAction<UserInfoType>> }> = ({userInfo, setUserInfo}) => {

    function handleAddAdult(){
        setUserInfo((prev)=>({...prev, adults: prev.adults+1}))
    }
    function handleRemoveAdult(){
        setUserInfo((prev)=>({...prev, adults: prev.adults-1}))
    }

    const disableMaxGuests = userInfo.adults + userInfo.children === 4;

    const disableBtnRemoveStyle = userInfo.adults === 1 ? styles.disable: "";
    const disableBtnAddStyle = disableMaxGuests? styles.disable: "";

    return(
        <div className={styles.guestsContainer}>
            <p>Adults: <span>{userInfo.adults}</span></p>
            <div className={styles.btnContainer}>
                <button className={disableBtnRemoveStyle} onClick={handleRemoveAdult} disabled={userInfo.adults===1}>-</button>
                <button className={disableBtnAddStyle} onClick={handleAddAdult} disabled={disableMaxGuests}>+</button>
            </div>
        </div>
    )
}

export default AdultsInput
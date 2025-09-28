import styles from "../styles/guestsInput.module.css"
import React, { FC, useState } from "react";
import AgeItem from "./AgeItem";
import Image from "next/image";
import openAgeItemsIcon from '../../public/images/openAgeItems.svg'


type UserInfoType = {
    dates: string[];
    adults: number;
    children: number;
    childrenAges: number[];
  };

const ChildrenInput: FC<{userInfo: UserInfoType, setUserInfo: React.Dispatch<React.SetStateAction<UserInfoType>> }> = ({userInfo, setUserInfo}) => {

    const [showAgeItems, setShowAgeItems] = useState<boolean>(false);

    function handleOpenCloseAges(){
        setShowAgeItems(prev=>!prev)
    }

    const handleAddChild = () => {
        setUserInfo((prev) => {
            return {
                ...prev, 
                children: prev.children + 1,
                childrenAges: [...prev.childrenAges, -1]
            }
        })
    }

    const handleRemoveChild = () => {
        setUserInfo((prev) => {
          const updatedAges = [...prev.childrenAges];
          updatedAges.pop(); 

          return {
            ...prev,
            children: prev.children - 1,
            childrenAges: updatedAges,
          }
        })
    }

    const disableMaxGuests = userInfo.adults + userInfo.children === 4;

    const disableBtnRemoveStyle = userInfo.children === 0 ? styles.disable: "";
    const disableBtnAddStyle = disableMaxGuests? styles.disable: "";


    return(
        <div style={{position: "relative"}}>
            <Image
                onClick={handleOpenCloseAges}
                style={{position: "absolute", top: "27px", transform: "rotate(180deg)", left: "6px", width: "13px", cursor: "pointer"}} 
                src={openAgeItemsIcon} 
                alt="openIcon"
            />
            <div className={styles.guestsContainer}>
                <p style={{marginLeft: "10px"}}>Children: <span>{userInfo.children}</span></p>
                <div className={styles.btnContainer}>
                    <button className={disableBtnRemoveStyle} onClick={handleRemoveChild} disabled={userInfo.children===0}>-</button>
                    <button className={disableBtnAddStyle} onClick={handleAddChild} disabled={disableMaxGuests}>+</button>
                </div>
            </div>

            {showAgeItems&&Array.from({ length: userInfo.children }, (_, index) => (
                <AgeItem 
                    key={index}
                    setUserInfo={setUserInfo}
                    childrenNumber={index+1}
                    style={{top: index === 0 ? "65px" : `${63 + 45 * index}px`}}
                    currentAge={userInfo.childrenAges[index] ?? -1}
                />
            ))}
        </div>
    )
}

export default ChildrenInput;
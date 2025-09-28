import styles from '../styles/ageItem.module.css'
import React, { FC } from "react";

type UserInfoType = {
    dates: string[];
    adults: number;
    children: number;
    childrenAges: number[];
};


const AgeItem:FC<{setUserInfo: React.Dispatch<React.SetStateAction<UserInfoType>>, childrenNumber:number, style: object, currentAge: number}> = ({childrenNumber, setUserInfo, style, currentAge})=>{

    const handleAgeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedAge = parseInt(event.target.value, 10);
    
        setUserInfo((prev) => {
          const updatedChildrenAges = [...prev.childrenAges];
          updatedChildrenAges[childrenNumber - 1] = selectedAge; 
          return { ...prev, childrenAges: updatedChildrenAges };
        });
      };

    return(
        <div className={styles.item} style={style}>
            <p>Child {childrenNumber}</p> 
            <select value={currentAge??-1} onChange={handleAgeChange}> 
                <option value="-1">Age needed</option>
                <option value="0">0 years old</option>
                <option value="1">1 year old</option>
                <option value="2">2 years old</option>
                <option value="3">3 years old</option>
                <option value="4">4 years old</option>
                <option value="5">5 years old</option>
                <option value="6">6 years old</option>
                <option value="7">7 years old</option>
                <option value="8">8 years old</option>
                <option value="9">9 years old</option>
                <option value="10">10 years old</option>
                <option value="11">11 years old</option>
                <option value="12">12 years old</option>
                <option value="13">13 years old</option>
                <option value="14">14 years old</option>
                <option value="15">15 years old</option>
                <option value="16">16 years old</option>
                <option value="17">17 years old</option>
            </select>
        </div>
    )
}

export default AgeItem;
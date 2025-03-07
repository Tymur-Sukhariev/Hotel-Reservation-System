import React, { FC, useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import styles from "../styles/datePicker.module.css";
import Image from "next/image";
import calendar from "../../public/images/calendar.svg";

type UserInfoType = {
  dates: string[];
  adults: number;
  children: number;
  childrenAges: number[];
};

const DatePicker: FC<{ setUserInfo: React.Dispatch<React.SetStateAction<UserInfoType>> }> = ({ setUserInfo }) => {

    const fpRef = useRef<flatpickr.Instance | null>(null); 

  useEffect(() => {

    const instance = flatpickr("#inputDate", {
      dateFormat: "Y-m-d",
      minDate: "today",
      mode: "range",
      onChange: (selectedDates, dateStr) => {
        const userDates = dateStr.split(" to ");
        
        setUserInfo((prev: UserInfoType) => ({
          ...prev,
          dates: userDates,
        }));
      },
    });


    fpRef.current = instance as flatpickr.Instance;

    return () => {

      fpRef.current?.destroy();
    };
  }, [setUserInfo]);

  function handleCalendarOpen() {
    fpRef.current?.open(); 
  }

  return (
    <div className={styles.container}>
      <input id="inputDate" placeholder="Check in / Check out" readOnly />
      <Image
        onClick={handleCalendarOpen}
        src={calendar as string}
        alt="calendarIcon"
      />
    </div>
  );
};

export default DatePicker;

"use client"

import DatePicker from '~/components/DatePicker';
import AdultsInput from '~/components/AdultsInput';
import styles from '../styles/home.module.css';
import React, { useEffect, useState } from "react";
import ChildrenInput from '~/components/ChildrenInput';
import { useRouter } from 'next/navigation';
import { getCookie, deleteCookie } from 'cookies-next'
import { toast } from 'react-hot-toast'


type UserInfoType = {
  dates: string[],
  adults: number,
  children: number,
  childrenAges: number[]
}

export type ParamsType = {
  checkin: string | undefined,
  checkout: string | undefined,
  adults: string,
  children?: string,
  childrenAges?: string
}

export default function Home() {


  const router = useRouter();

  useEffect(() => {
    const success = getCookie('booking_success')
    if (success) {
      toast.success('Booking successful!')
      deleteCookie('booking_success')
    }
  }, [])

  const [userInfo, setUserInfo] = useState<UserInfoType>({
    dates: [],
    adults: 1,
    children: 0,
    childrenAges: []
  })

  function handleSearch() {
    if (userInfo.dates.length !== 2) {
      alert("No Dates Selected");
      return
    }
    if (userInfo.childrenAges.includes(-1)) {
      alert("No Age Selected For Children!");
      return
    }
    const params: ParamsType = {
      checkin: userInfo.dates[0],
      checkout: userInfo.dates[1],
      adults: userInfo.adults.toString(),
    };

    if (userInfo.children > 0) {
      params["children"] = userInfo.children.toString();
      params["childrenAges"] = userInfo.childrenAges.join(",");
    }

    const queryParams = new URLSearchParams(params as Record<string, string>);

    router.push(`/search-results?${queryParams.toString()}`);

  }

  return (
    <>
      <div className={styles.main}>
        <h1>Stay with Comfort Leave with Memories</h1>
        <div className={styles.inputContainer}>
          <DatePicker setUserInfo={setUserInfo} />
          <AdultsInput userInfo={userInfo} setUserInfo={setUserInfo} />
          <ChildrenInput userInfo={userInfo} setUserInfo={setUserInfo} />
          <div className={styles.btnContainer}>
            <button onClick={handleSearch} className={styles.btn}>Search</button>
          </div>
        </div>
      </div>
    </>
  );
}

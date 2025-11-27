"use client"

import { useState } from "react";
import styles from '../../styles/searchResults.module.css'
import Room from "~/components/Room";
import MultiRangeSlider from '../../components/MultiRangeSlider'
import { useQuery } from '@tanstack/react-query';
import { getPrice } from "~/utils/getPrice";
import { roomSearchAction } from "~/server/action";

const roomTypes: Record<string, string[]> = {
  "2": ["Double", "Double Twin"],
  "3": ["Triple Twin", "Triple Double Twin"],
};

type Props = {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  totalGuests: number
}


export default function SearchResultsClient({ checkIn, checkOut, children, totalGuests }: Props) {
  const [minPrice, setMinPrice] = useState(40);
  const [maxPrice, setMaxPrice] = useState(160);
  const [selectedFacilities, setSelectedFacilities] = useState({
    tv: false,
    ac: false,
    bath: false,
  });
  const [selectedRoomType, setSelectedRoomType] = useState<string | null>(null);

  const { data, isPending, error } = useQuery({
    queryKey: ['freeRooms', checkIn, checkOut, totalGuests, minPrice, maxPrice, selectedFacilities, selectedRoomType],
    queryFn: () => roomSearchAction(checkIn, checkOut, totalGuests, { minPrice, maxPrice, selectedFacilities, selectedRoomType }),
  });

  const hasResults = data && data.length > 0;
  const noResults = data && data.length === 0;
  const foundRoomTypes = totalGuests === 2 || totalGuests === 3 ? roomTypes[totalGuests] : [];


  function handlePriceChange({ min, max }: { min: number; max: number }) {
    setMinPrice(min);
    setMaxPrice(max);
  }

  function handleFacilityChange(facility: keyof typeof selectedFacilities) {
    setSelectedFacilities((prev) => ({ ...prev, [facility]: !prev[facility] }));
  }

  function handleRoomTypeChange(roomType: string) {
    setSelectedRoomType(roomType);
  }

  // console.log("DTA", data);


  return (
    <div className={styles.serachContainer}>
      {error && <SearchError error={error} />}
      {hasResults && <h1>Search Results</h1>}

      <div className={styles.roomsContainer}>
        {noResults && <NoResults />}
        {isPending && <Loading />}

        {data?.map((element, index) => {
          const finalPrice = getPrice(checkIn, checkOut, element.price, children)
          return <Room
            key={index}
            {...element}
            price={finalPrice}
            checkIn={checkIn}
            checkOut={checkOut}
            children={children}
          />
        })}

      </div>


      <div className={styles.filterContainer}>
        <h1 style={{ fontWeight: "600" }}>Filters</h1>
        <hr />
        <h1>Your budget (per night)</h1>

        <MultiRangeSlider
          min={40}
          max={160}
          onChange={({ min, max }) => handlePriceChange({ min, max })}
          defaultMax={maxPrice}
          defaultMin={minPrice}
        />

        <hr />

        <div className={styles.optionsContainer}>
          <h1>Essentials</h1>
          <div>
            <input
              type="checkbox"
              checked={selectedFacilities.tv}
              onChange={() => handleFacilityChange('tv')}
            />
            <label>TV</label>
          </div>
          <div>
            <input
              type="checkbox"
              checked={selectedFacilities.ac}
              onChange={() => handleFacilityChange('ac')}
            />
            <label>AC</label>
          </div>
          <div>
            <input
              type="checkbox"
              checked={selectedFacilities.bath}
              onChange={() => handleFacilityChange('bath')}
            />
            <label>Bath</label>
          </div>
        </div>

        <div className={styles.optionsContainer}>
          {foundRoomTypes!.length > 0 && (
            <div>
              <hr />
              <h1>Room Type</h1>
              {foundRoomTypes!.map((type, index) => (
                <div key={index}>
                  <input
                    name="typeRadio"
                    type="radio"
                    checked={selectedRoomType === type}
                    onChange={() => handleRoomTypeChange(type)}
                  />
                  <label>{type}</label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

function SearchError({ error }: { error: Error }) {
  return <div style={{ textAlign: "center", marginTop: "300px" }}>Error: {error.message}</div>
}

function NoResults() {
  return <div style={{ textAlign: "center", marginTop: "300px" }}>NO ROOMS FOUND FOR YOUR DATES.</div>
}

function Loading() {
  return <div style={{ textAlign: "center", marginTop: "300px" }}>Loading...</div>
}

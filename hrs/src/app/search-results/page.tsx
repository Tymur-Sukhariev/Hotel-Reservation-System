import SearchResultsClient from "./client-side";

type PageProps = {
  searchParams: Promise<Record<string, string>>;
}


export default async function  SearchResults ({searchParams}: PageProps)  {

  const search = await searchParams;
  const checkIn = search?.checkin ?? ""
  const checkOut = search?.checkout ?? ""
  const adults: number = +(search?.adults || 0);
  const childrenAges = search?.childrenAges?.split(',').filter(Boolean).map(Number) ?? [];
  const children = childrenAges?.length;
  const totalGuests = adults + childrenAges.filter(age => age > 2).length;

  return (
      <SearchResultsClient 
        checkIn={checkIn}
        checkOut={checkOut}
        totalGuests={totalGuests}
        adults={adults}
        children={children}
      />
  );
};

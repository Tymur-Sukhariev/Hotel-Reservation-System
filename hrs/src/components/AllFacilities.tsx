import Facility from "./Facility"

const allFacilities = [
    "Wi-Fi",
    "Private Shower",
    "Every Day Cleaning",
    "Towels",
    "Hairdryer",
    "Toilet paper",
    "Linens",
    "Electric kettle",
    "Safe",
    "Pets Allowed"
]

type Props = {
    isAC: boolean,
    isBath: boolean, 
    isTV: boolean
}

export default function AllFacilities({isAC, isBath, isTV}:Props){

    return(
        <div>
            <h1>All Facilities</h1>

            {isTV&&<Facility facility={"TV"}/>}
            {isBath&&<Facility facility={"Bath"}/>}
            {isAC&&<Facility facility={"AC"}/>}

            {allFacilities.map((facility, index)=>(<Facility key={index} facility={facility}/>))}
        </div>
    )
}
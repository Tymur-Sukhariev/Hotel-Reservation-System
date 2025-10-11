"use server"

import { db } from "../db";

const typesData = [
  {
    type: "Single",
    comfort: "Standard",
    previewText: "Standard Single: Ideal for solo travelers, offering a comfortable stay with essential amenities.",
    description: "The Standard Single room is thoughtfully designed for solo travelers who value simplicity and convenience. Featuring a cozy single bed, this room provides all the essentials for a pleasant stay, including a private bathroom, complimentary Wi-Fi, and a workspace to handle any tasks during your trip. Natural lighting and simple decor create a welcoming atmosphere. Additional amenities include a wardrobe for your belongings and a coffee maker to help you start your day right. Whether you're visiting for work or leisure, this room ensures a peaceful and functional experience without unnecessary frills. Enjoy the perfect balance of comfort and practicality, tailored to meet your travel needs.",
  },
  {
    type: "Single",
    comfort: "Comfort",
    previewText: "Comfort Single: Designed for solo travelers, offering extra space and enhanced amenities.",
    description: "The Comfort Single room is perfect for solo travelers who appreciate a bit more space and attention to detail. Equipped with a comfortable single bed, this room offers upgraded features such as a larger private bathroom with high-quality fixtures, a well-lit workspace, and a lounge chair for relaxation. The decor is modern yet warm, creating a cozy environment for your stay. Stay connected with complimentary high-speed Wi-Fi and unwind with an in-room flat-screen TV. The room also includes a wardrobe, a coffee maker, and additional touches like blackout curtains to ensure a restful night. Whether you're here for business or leisure, this room promises a relaxing and efficient experience, tailored just for you.",
  },
  {
    type: "Double",
    comfort: "Standard",
    previewText: "Standard Double: A great option for couples or friends, offering a cozy stay with essential features.",
    description: "The Standard Double room is an excellent choice for couples or close friends traveling together. With a spacious double bed and a well-organized layout, this room is designed to provide comfort and functionality. Amenities include a private bathroom, complimentary Wi-Fi, and a simple yet inviting decor that makes it feel like a home away from home. Guests can make use of the workspace, a compact wardrobe, and basic conveniences such as a coffee maker and bedside lamps. The room's atmosphere is cozy and practical, ensuring you have everything you need for a relaxing and enjoyable stay, whether for a short visit or an extended trip.",
  },
  {
    type: "Double",
    comfort: "Comfort",
    previewText: "Comfort Double: Perfect for two, offering additional space and upgraded features for a relaxing stay.",
    description: "The Comfort Double room is designed to provide an enhanced experience for two guests, whether you're a couple or friends traveling together. This room includes a spacious double bed with soft linens and a comfortable layout that allows for easy movement. The decor is warm and inviting, complemented by modern furnishings and ample natural light. Additional amenities include a larger private bathroom with quality toiletries, a flat-screen TV, and a well-equipped workspace. For your convenience, the room features a wardrobe, coffee maker, and bedside tables with individual lighting. Whether you're here to explore the city or unwind, this room offers a peaceful retreat after a busy day.",
  },

  {
    type: "Double Twin",
    comfort: "Standard",
    previewText: "Standard Double Twin: Ideal for pairs, featuring two separate beds and essential amenities.",
    description: "The Standard Double Twin room is a practical choice for two guests who prefer separate sleeping arrangements. With two cozy twin beds, this room is well-suited for friends, colleagues, or family members. It features a private bathroom with basic toiletries, a compact workspace, and complimentary Wi-Fi to stay connected. The decor is simple yet inviting, creating a comfortable environment for relaxation. Additional conveniences include a wardrobe for your belongings and a coffee maker for your morning routine. Whether you're on a business trip or a leisure getaway, this room offers everything you need for a pleasant and hassle-free stay.",
  },
  {
    type: "Double Twin",
    comfort: "Comfort",
    previewText: "Comfort Double Twin: Spacious and modern, offering two beds and upgraded amenities for a cozy stay.",
    description: "The Comfort Double Twin room is perfect for two guests who value both space and comfort. Featuring two plush twin beds, this room provides a balance of style and practicality. The decor is modern and welcoming, with thoughtful touches that create a cozy atmosphere. Guests can enjoy a larger private bathroom with premium toiletries, a flat-screen TV for entertainment, and a well-lit workspace. Additional amenities include a wardrobe, coffee maker, and blackout curtains for a restful night's sleep. Whether you're traveling for work or leisure, this room ensures a comfortable and enjoyable stay tailored to your needs.",
  },
  {
    type: "Triple Twin",
    comfort: "Standard",
    previewText: "Standard Triple Twin: Perfect for groups of three, offering three separate beds and basic comforts.",
    description: "The Standard Triple Twin room is an ideal choice for groups of three travelers who prefer separate beds. With three comfortable twin beds and a thoughtfully arranged layout, this room ensures a cozy and functional stay. It includes a private bathroom, complimentary Wi-Fi, and a simple workspace for added convenience. The decor is minimal yet warm, creating an inviting atmosphere. Additional features include a compact wardrobe, bedside tables, and a coffee maker to start your day off right. Whether you're exploring the area or on a group trip, this room provides everything you need for a pleasant stay.",
  },
  {
    type: "Triple Twin",
    comfort: "Comfort",
    previewText: "Comfort Triple Twin: Spacious and well-appointed, offering three beds and enhanced amenities.",
    description: "The Comfort Triple Twin room is designed to accommodate groups of three guests in a spacious and stylish setting. With three comfortable twin beds, this room provides plenty of space for everyone to relax. The decor is modern and inviting, complemented by ample natural light and high-quality furnishings. Guests can enjoy a larger private bathroom with premium toiletries, a flat-screen TV, and a well-lit workspace. Additional amenities include a wardrobe, a coffee maker, and blackout curtains for a restful sleep. Perfect for families or groups of friends, this room offers a blend of comfort and convenience.",
  },
  {
    type: "Triple Double Twin",
    comfort: "Standard",
    previewText: "Standard Triple Double Twin: Ideal for families or groups, offering a mix of double and twin beds.",
    description: "The Standard Triple Double Twin room is perfect for families or groups seeking versatile sleeping arrangements. With one double bed and two twin beds, this room provides ample space and flexibility. The decor is simple yet comfortable, ensuring a relaxing environment for all guests. Key features include a private bathroom, complimentary Wi-Fi, and a compact workspace. Additional amenities such as a wardrobe, bedside tables, and a coffee maker enhance the overall experience. Whether you're visiting for a short stay or an extended trip, this room offers practical comfort tailored to your needs.",
  },
  {
    type: "Triple Double Twin",
    comfort: "Comfort",
    previewText: "Comfort Triple Double Twin: Spacious and versatile, offering premium comfort for families or groups.",
    description: "The Comfort Triple Double Twin room is the ultimate choice for families or groups who value both space and comfort. Featuring one luxurious double bed and two twin beds, this room is designed to accommodate up to three guests in style. The modern decor, enhanced by soft lighting and high-quality furnishings, creates a warm and inviting atmosphere. Guests can enjoy a larger private bathroom with premium toiletries, a flat-screen TV for entertainment, and a well-lit workspace. Additional features include a wardrobe, a coffee maker, and blackout curtains for a peaceful night's sleep. This room ensures a memorable stay for every guest.",
  },
  {
    type: "Family",
    comfort: "Standard",
    previewText: "Standard Family: Designed for families, offering spacious accommodations and essential amenities.",
    description: "The Standard Family room is thoughtfully designed to accommodate families traveling together. With multiple sleeping options and a spacious layout, this room ensures everyone has enough space to relax. The decor is simple and inviting, creating a warm atmosphere for your stay. Key features include a private bathroom, complimentary Wi-Fi, and a functional workspace. Additional amenities such as a wardrobe, bedside tables, and a coffee maker add convenience to your experience. Perfect for short getaways or extended stays, this room provides a comfortable and practical solution for family travel.",
  },
  {
    type: "Family",
    comfort: "Comfort",
    previewText: "Comfort Family: Spacious and cozy, offering upgraded amenities for a relaxing family retreat.",
    description: "The Comfort Family room is the perfect choice for families seeking extra space and premium comfort. With a well-designed layout and multiple sleeping options, this room accommodates everyone in style. The decor is modern and welcoming, with soft lighting and high-quality furnishings. Guests can enjoy a larger private bathroom with premium toiletries, a flat-screen TV for entertainment, and a well-equipped workspace. Additional features include a wardrobe, a coffee maker, and blackout curtains to ensure a peaceful stay. Whether you're on vacation or visiting for a special occasion, this room guarantees a memorable family retreat.",
  },
];

const pricesData = [
  { price: 40 }, // Standard Single without anything
  { price: 45 }, // Standard Single with Tv
  { price: 50 }, // Comfort Single only with TV
  { price: 55 }, // Comfort Single with AC/Bath/Both
  { price: 60 }, // Standard Double, Standard Double Twin without anything
  { price: 65 }, // Standard Double, Standard Double Twin with TV
  { price: 70 }, // Comfort Double, Comfort Double twin only with TV
  { price: 80 }, // Comfort Double, Comfort Double twin with AC/Bath/Both
  { price: 100 }, // Standard Triple, Standard Triple Twin without anything
  { price: 105 }, // Standard Triple, Standard Triple with TV
  { price: 110 }, // Comfort Triple, Comfort Triple Twin only with TV
  { price: 120 }, // Comfort Triple, Comfort Triple Twin with AC/Bath/Both
  { price: 140 }, // Standard Family without anything
  { price: 145 }, // Standard Family with Tv
  { price: 150 }, // Comfort Family only with TV
  { price: 160 }, // Comfort Family with AC/Bath/Both
];

export async function createTypes() {

  await db.types.createMany({
    data: typesData,
    skipDuplicates: true,
  });
}

export async function createPrices() {
  await db.roomPrices.createMany({
    data: pricesData,
    skipDuplicates: true,
  });

}
export async function createRoomsAndFacilities() {
  const types = await db.types.findMany();
  const prices = await db.roomPrices.findMany();

  let floor = 1;
  let countRooms = 0; // 10 per floor

  for (const type of types) {
    for (let i = 0; i < 5; i++) {
      if (countRooms > 9) {
        countRooms = 0;
        floor++;
      }

      const roomNumber = `${floor}0${countRooms}`;
      const booked = Math.floor(Math.random() * 10) + 1;

      // Determine guests based on room type
      const guests = type.type === "Single" ? 1
        : type.type === "Double" || type.type === "Double Twin" ? 2
          : type.type === "Triple Twin" ? 3
            : type.type === "Triple Double Twin" ? 3
              : type.type === "Family" ? 4
                : 1;


      // Determine facilities based on comfort level
      let tv = false, ac = false, bath = false;
      if (type.comfort === "Standard") {
        // Standard: 50% chance for TV
        tv = Math.random() < 0.5;
      } else if (type.comfort === "Comfort") {
        // Comfort: Always has TV, 50% chance for AC and bath
        tv = true;
        ac = Math.random() < 0.5;
        bath = ac ? true : Math.random() < 0.5; // If has AC, always has bath
      }

      // Determine price based on type, comfort, and facilities
      let priceIndex: number;

      if (guests === 1) { // Single rooms
        if (type.comfort === "Standard") {
          priceIndex = !tv ? 0 : 1; // 40 or 45
        } else { // Comfort
          priceIndex = !ac && !bath ? 2 : 3; // 50 or 55
        }
      } else if (guests === 2) { // Double rooms
        if (type.comfort === "Standard") {
          priceIndex = !tv ? 4 : 5; // 60 or 65
        } else { // Comfort
          priceIndex = !ac && !bath ? 6 : 7; // 70 or 80
        }
      } else if (guests === 3) { // Triple rooms
        if (type.comfort === "Standard") {
          priceIndex = !tv ? 8 : 9; // 100 or 105
        } else { // Comfort
          priceIndex = !ac && !bath ? 10 : 11; // 110 or 120
        }
      } else if (guests === 4) { // Family rooms
        if (type.comfort === "Standard") {
          priceIndex = !tv ? 12 : 13; // 140 or 145
        } else { // Comfort
          priceIndex = !ac && !bath ? 14 : 15; // 150 or 160
        }
      }

      const room = await db.rooms.create({
        data: {
          id: parseInt(roomNumber),
          priceId: prices[priceIndex!]!.id,
          guests,
          typeId: type.id,
          booked,
        },
      });

      await db.facilities.create({
        data: {
          roomId: room.id,
          tv,
          ac,
          bath,
        },
      });

      countRooms++;
    }
  }
}
export async function createRoomImages() {

  const types = await db.types.findMany();
  const imagesData = [];

  imagesData.push(
    { imageUrl: `universal1.jpg`, order: 2 },
    { imageUrl: `universal2.jpg`, order: 3 },
    { imageUrl: `universal3.jpg`, order: 4 }
  );

  for (const type of types) {
    const formattedType = type.type.replace(/\s+/g, "");
    const formattedComfort = type.comfort.replace(/\s+/g, "");

    imagesData.push({ typeId: type.id, imageUrl: `${formattedType}${formattedComfort}.jpg`, order: 1 })
  }
  await db.roomImages.createMany({
    data: imagesData,
    skipDuplicates: true,
  });
}

// async function deleteUsers() {
//   await db.users.deleteMany();

// }

// async function getUsers() {
//   // 1) Query without relations
//   const res = await db.users.findMany({
//     select: { id: true, email: true, firstName: true, lastName: true }
//   });

//   return res;

// }

// await deleteUsers();
// await createRoomImages();
// console.log(await getUsers());

// console.log("Done");



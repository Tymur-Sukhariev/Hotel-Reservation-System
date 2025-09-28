import { db } from '../db';

interface SearchRoomsArgs {
  checkIn: string;
  checkOut: string;
  guests: number;
  filters?: {
    minPrice?: number;
    maxPrice?: number;
    selectedFacilities?: {
      tv: boolean;
      ac: boolean;
      bath: boolean;
    };
    selectedRoomType?: string | null;
  };
}

interface RoomResult {
  typeId: number;
  type: string;
  comfort: string;
  price: number;
  facilities: {
    tv: boolean;
    ac: boolean;
    bath: boolean;
  };
  img: string;
  prevText: string;
}

export const searchRooms = async (
  checkIn: string,
  checkOut: string,
  guests: number,
  filters?: SearchRoomsArgs['filters']
): Promise<RoomResult[]> => {
  try {
    const availableRooms = await db.rooms.findMany({
      where: {
        guests,
        bookings: {
          none: {
            AND: [
              { checkOut: { gt: new Date(checkIn) } },
              { checkIn: { lt: new Date(checkOut) } },
            ],
          },
        },
        ...(filters?.selectedFacilities ? {
          facilities: {
            AND: Object.entries(filters.selectedFacilities)
              .filter(([_, value]) => value)
              .map(([key, _]) => ({ [key]: true }))
          }
        } : {}),
        price: {
          price: {
            gte: filters?.minPrice || 40,
            lte: filters?.maxPrice || 350,
          }
        },
        type: filters?.selectedRoomType ? {
          type: filters.selectedRoomType
        } : undefined,
      },
      include: {
        type: {
          include: {
            images: {
              where: { order: 1 },
              take: 1,
            },
          },
        },
        price: true,
        facilities: true,
      },
    });

    // Create a Map to store unique combinations
    const uniqueCombinations = new Map<string, RoomResult>();

    availableRooms.forEach((room) => {
      // Create a composite key of the distinguishing features
      const key = `${room.type.type}-${room.type.comfort}-${room.facilities?.tv}-${room.facilities?.ac}-${room.facilities?.bath}`;

      // Only add if this combination doesn't exist yet
      if (!uniqueCombinations.has(key)) {
        uniqueCombinations.set(key, {
          typeId: room.type.id,
          type: room.type.type,
          comfort: room.type.comfort,
          price: room.price.price,
          facilities: {
            tv: room.facilities?.tv || false,
            ac: room.facilities?.ac || false,
            bath: room.facilities?.bath || false,
          },
          img: room.type.images[0]?.imageUrl || '',
          prevText: room.type.previewText,
        });
      }
    });

    return Array.from(uniqueCombinations.values());

  } catch (error) {
    console.error("Error executing database query:", error);
    throw new Error("Database query failed");
  }
};
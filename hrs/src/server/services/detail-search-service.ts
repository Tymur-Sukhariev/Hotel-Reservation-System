import { db } from '../db';

interface RoomDetailsInput {
  typeId: number;
  facilities: {
    tv: boolean;
    ac: boolean;
    bath: boolean;
  };
  checkIn: string;
  checkOut: string;
}

interface RoomDetailsResponse {
  type_id: number;
  type: string;
  comfort: string;
  price: number;
  images: string[];
  description: string;
  isAvailable: boolean;
}

export const getRoomDetails = async (params: RoomDetailsInput): Promise<RoomDetailsResponse> => {
  try {
    // Get type-specific images and room details
    const roomType = await db.types.findUniqueOrThrow({
      where: {
        id: params.typeId,
      },
      include: {
        images: {
          orderBy: {
            order: 'asc'
          },
          select: {
            imageUrl: true
          }
        },
        rooms: {
          take: 1,
          include: {
            price: true
          }
        }
      }
    });

    // Get all universal images from all types
    const universalImages = await db.roomImages.findMany({
      where: {
        imageUrl: {
          contains: 'universal',
          mode: 'insensitive'  // Case insensitive search
        }
      },
      orderBy: {
        order: 'asc'
      },
      distinct: ['imageUrl'],  // Get unique images only
      select: {
        imageUrl: true
      }
    });

    if (!roomType.rooms[0]) {
      throw new Error('No rooms found for this type');
    }

    // Get a room with requested facilities for price
    const roomWithPrice = await db.rooms.findFirst({
      where: {
        typeId: params.typeId,
        facilities: {
          tv: params.facilities.tv,
          ac: params.facilities.ac,
          bath: params.facilities.bath
        }
      },
      include: {
        price: true
      }
    });

    if (!roomWithPrice) {
      throw new Error('No rooms found with specified facilities');
    }

    // Availability check
    const availableRoom = await db.rooms.findFirst({
      where: {
        typeId: params.typeId,
        facilities: {
          tv: params.facilities.tv,
          ac: params.facilities.ac,
          bath: params.facilities.bath
        },
        bookings: {
          none: {
            AND: [
              { checkOut: { gt: new Date(params.checkIn) } },
              { checkIn: { lt: new Date(params.checkOut) } }
            ]
          }
        }
      }
    });

    // Combine type-specific and universal images
    const allImages = [
      ...roomType.images.map(img => img.imageUrl),
      ...universalImages.map(img => img.imageUrl)
    ];

    return {
      type_id: roomType.id,
      type: roomType.type,
      comfort: roomType.comfort,
      price: roomWithPrice.price.price,
      images: allImages,
      description: roomType.description,
      isAvailable: !!availableRoom
    };
  } catch (error) {
    console.error('Error fetching room details:', error);
    if (error instanceof Error && error.message.includes('No rooms found')) {
      throw error;
    }
    throw new Error('Failed to fetch room details');
  }
};
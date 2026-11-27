import { z } from 'zod';

import type { Studio, StudioRoom } from '@shared/model';

type RoomDto = Omit<StudioRoom, 'pricePerHour'> & { price_per_hour: number };
export type StudioDto = Omit<Studio, 'rooms' | 'pricePerHour'> & {
    price_per_hour: number;
    rooms?: readonly RoomDto[];
};

export function toStudio({ price_per_hour, rooms, ...studio }: StudioDto): Studio {
    return {
        ...studio,
        pricePerHour: price_per_hour,
        ...(rooms && {
            rooms: rooms.map(({ price_per_hour, ...room }) => ({
                ...room,
                pricePerHour: price_per_hour,
            })),
        }),
    };
}
export function toStudioDto({ pricePerHour, rooms, ...studio }: Studio): StudioDto {
    return {
        ...studio,
        price_per_hour: pricePerHour,
        ...(rooms && {
            rooms: rooms.map(({ pricePerHour, ...room }) => ({
                ...room,
                price_per_hour: pricePerHour,
            })),
        }),
    };
}

export const studioDtoSchema = z.object({
    id: z.string(),
    name: z.string(),
    city: z.string(),
    price_per_hour: z.number(),
    coverUrl: z.string(),
    isOpen: z.boolean(),
    rating: z.number().optional(),
    featured: z.boolean().optional(),
    isNew: z.boolean().optional(),
    description: z.string().optional(),
    rooms: z
        .array(z.object({ id: z.string(), name: z.string(), price_per_hour: z.number() }))
        .optional(),
});

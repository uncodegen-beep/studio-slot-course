import { type HttpResourceRef, httpResource } from '@angular/common/http';

import { z } from 'zod';

export const slotsSchema = z.array(z.number().int().min(0).max(23));
export function roomSlots(
    studioId: () => string,
    roomId: () => string | undefined,
): HttpResourceRef<number[] | undefined> {
    return httpResource<number[]>(
        () => {
            const room = roomId();
            return room
                ? 'api/studios/' +
                      encodeURIComponent(studioId()) +
                      '/rooms/' +
                      encodeURIComponent(room) +
                      '/slots'
                : undefined;
        },
        { parse: (body) => slotsSchema.parse(body) },
    );
}

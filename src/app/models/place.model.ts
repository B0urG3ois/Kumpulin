
export interface Place {
    name: string;
    address: string;
    imgUrl: string;
    jenisSampah: any[];
    coordinateLat: number;
    coordinateLng: number;
}

export type PlaceMapModel = Place & {id:string, jarak:number, waktu:number}

export interface User {
    address: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    point: number;
}

export type UserViewModel = User & {id: string};
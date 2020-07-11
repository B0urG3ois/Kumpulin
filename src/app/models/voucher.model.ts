export interface Voucher{
    name: string;
    price: number;
    qty: number;
    imgUrl: string;
}

export type VoucherViewModel = Voucher & {id:string};
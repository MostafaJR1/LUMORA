import { SHOTS } from "../Productshots";

export type Product = { id: string; name: string; size: string; price: number; img: string };

export const CURRENCY = "د.م.";

// MOCK catalog: replace the price and photo with your real ones.
// Only ids + quantities are stored in the browser; prices always come from here (and later from the server).
export const PRODUCTS: Product[] = [
  { id: "lumora-shampoo-150", name: "شامبو LUMORA ضد التساقط", size: "150 مل", price: 149, img: SHOTS.square.src },
];

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);
export const money = (n: number) => `${n.toLocaleString("en-US")} ${CURRENCY}`;

// MOCK shipping fee: replace with your real delivery price (0 = free).
export const SHIPPING_FEE: number = 30;

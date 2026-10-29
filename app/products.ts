import { SHOTS } from "./Productshots";

export type Product = { id: string; name: string; size: string; price: number; img: string };

export const CURRENCY = "د.م.";
// TODO: Confirm delivery and returns terms before launch.
export const DELIVERY_ESTIMATE = "2–4 أيام عمل";
export const RETURNS_PROMISE = "إرجاع مجاني خلال 14 يوماً";

// Product details are shared by the landing page and cart.
// Only ids + quantities are stored in the browser; prices always come from here (and later from the server).
export const PRODUCTS: Product[] = [
  { id: "lumora-shampoo-150", name: "شامبو LUMORA ضد التساقط", size: "150 مل", price: 149, img: SHOTS.square.src },
];

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);
export const money = (n: number) => `${n.toLocaleString("en-US")} ${CURRENCY}`;

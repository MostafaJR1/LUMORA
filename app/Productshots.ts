const alt = "زجاجة شامبو LUMORA ضد تساقط الشعر";

export const SHOTS = {
  heroCampaign: { src: "https://res.cloudinary.com/dg7htktxp/image/upload/v1793548159/Shampoo_bottle_on_marble_vanity_28dbb7c8_2K_d0vswp.jpg", w: 1600, h: 900, alt: "حملة شامبو LUMORA ضد تساقط الشعر" },
  botanicalPortrait: { src: "https://res.cloudinary.com/dg7htktxp/image/upload/v1793548154/Lumora_Anti-Hair_Loss_Shampoo_Spa_Still_Life_y5lzhx.png", w: 1024, h: 1536, alt },
  marbleLifestyle: { src: "https://res.cloudinary.com/dg7htktxp/image/upload/v1793548159/Shampoo_bottle_on_marble_vanity_28dbb7c8_2K_d0vswp.jpg", w: 1600, h: 900, alt: "شامبو LUMORA على سطح رخامي مع الأعشاب الطبيعية" },
  bottleBack: { src: "https://res.cloudinary.com/dg7htktxp/image/upload/v1793548149/Shampoo_Bottle_Back_Label_Product_Shot_olvbmq.png", w: 1024, h: 1536, alt: "ظهر عبوة LUMORA والمكونات" },
  bottleFront: { src: "https://res.cloudinary.com/dg7htktxp/image/upload/v1793548154/LUMORA_Anti-Hair_Loss_Shampoo_Bottle_h47gkg.png", w: 1024, h: 1536, alt },
  haircareCampaign: { src: "https://res.cloudinary.com/dg7htktxp/image/upload/v1793548154/Lumora_Anti-Hair_Loss_Shampoo_Spa_Still_Life_y5lzhx.png", w: 1024, h: 1536, alt: "حملة عناية الشعر الطبيعية من LUMORA" },
} as const;

export type ShotKey = keyof typeof SHOTS;
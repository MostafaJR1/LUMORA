export const U = (id: string, w = 900) => {
  void w;
  return id.startsWith("/") ? id : `/${id}`;
};

export const IMG = {
  hero: "https://res.cloudinary.com/dg7htktxp/image/upload/v1793548159/Shampoo_bottle_on_marble_vanity_28dbb7c8_2K_d0vswp.jpg",
  shampoo: "https://res.cloudinary.com/dg7htktxp/image/upload/v1793548154/LUMORA_Anti-Hair_Loss_Shampoo_Bottle_h47gkg.png",
  care: "https://res.cloudinary.com/dg7htktxp/image/upload/v1793548154/Lumora_Anti-Hair_Loss_Shampoo_Spa_Still_Life_y5lzhx.png",
  routine: "https://res.cloudinary.com/dg7htktxp/image/upload/v1793548159/Shampoo_bottle_on_marble_vanity_28dbb7c8_2K_d0vswp.jpg",
  videoPoster: "https://res.cloudinary.com/dg7htktxp/image/upload/v1793548154/Lumora_Anti-Hair_Loss_Shampoo_Spa_Still_Life_y5lzhx.png",
  people: [
    "https://res.cloudinary.com/dg7htktxp/image/upload/v1793548154/LUMORA_Anti-Hair_Loss_Shampoo_Bottle_h47gkg.png",
    "https://res.cloudinary.com/dg7htktxp/image/upload/v1793548154/Lumora_Anti-Hair_Loss_Shampoo_Spa_Still_Life_y5lzhx.png",
    "https://res.cloudinary.com/dg7htktxp/image/upload/v1793548159/Shampoo_bottle_on_marble_vanity_28dbb7c8_2K_d0vswp.jpg",
    "https://res.cloudinary.com/dg7htktxp/image/upload/v1793548149/Shampoo_Bottle_Back_Label_Product_Shot_olvbmq.png",
  ],
  ugc: [
    "https://res.cloudinary.com/dg7htktxp/image/upload/v1793548154/Lumora_Anti-Hair_Loss_Shampoo_Spa_Still_Life_y5lzhx.png",
    "https://res.cloudinary.com/dg7htktxp/image/upload/v1793548154/Lumora_Anti-Hair_Loss_Shampoo_Spa_Still_Life_y5lzhx.png",
    "https://res.cloudinary.com/dg7htktxp/image/upload/v1793548159/Shampoo_bottle_on_marble_vanity_28dbb7c8_2K_d0vswp.jpg",
    "https://res.cloudinary.com/dg7htktxp/image/upload/v1793548149/Shampoo_Bottle_Back_Label_Product_Shot_olvbmq.png",
  ],
};

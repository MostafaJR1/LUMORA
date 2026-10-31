const alt = "زجاجة شامبو LUMORA ضد تساقط الشعر";

export const SHOTS = {
  heroCampaign: { src: "/lumora-hero-campaign.png", w: 1024, h: 1536, alt: "حملة شامبو LUMORA ضد تساقط الشعر" },
  botanicalPortrait: { src: "/lumora-botanical-portrait.jpg", w: 800, h: 1200, alt },
  marbleLifestyle: { src: "/lumora-marble-lifestyle.jpg", w: 1600, h: 900, alt: "شامبو LUMORA على سطح رخامي مع الأعشاب الطبيعية" },
  bottleBack: { src: "/lumora-bottle-back.png", w: 1024, h: 1536, alt: "ظهر عبوة LUMORA والمكونات" },
  bottleFront: { src: "/lumora-bottle-front.png", w: 1024, h: 1536, alt },
  haircareCampaign: { src: "/lumora-haircare-campaign.png", w: 1024, h: 1536, alt: "حملة عناية الشعر الطبيعية من LUMORA" },
} as const;

export type ShotKey = keyof typeof SHOTS;
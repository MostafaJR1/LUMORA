export const U = (id: string, w = 900) => {
  void w;
  return id.startsWith("/") ? id : `/${id}`;
};

export const IMG = {
  hero: "/lumora-hero-campaign.png",
  shampoo: "/lumora-bottle-front.png",
  care: "/lumora-botanical-portrait.jpg",
  routine: "/lumora-marble-lifestyle.jpg",
  videoPoster: "/lumora-haircare-campaign.png",
  people: [
    "/lumora-bottle-front.png",
    "/lumora-botanical-portrait.jpg",
    "/lumora-marble-lifestyle.jpg",
    "/lumora-bottle-back.png",
  ],
  ugc: [
    "/lumora-haircare-campaign.png",
    "/lumora-botanical-portrait.jpg",
    "/lumora-marble-lifestyle.jpg",
    "/lumora-bottle-back.png",
  ],
};

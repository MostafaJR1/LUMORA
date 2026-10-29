// MOCK MEDIA — public Unsplash photos + a CC0 MDN sample video.
// Replace every entry with your real product photos, customer photos and video before launch.
export const U = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`;

export const IMG = {
  hero: "photo-1522337360788-8b13dee7a37e",
  shampoo: "photo-1556228720-195a672e8a03",
  care: "photo-1596462502278-27bfdc403348",
  routine: "photo-1571781926291-c477ebfd024b",
  videoPoster: "photo-1519699047748-de8e457a634e",
  people: [
    "photo-1494790108377-be9c29b29330",
    "photo-1507003211169-0a1dd7228f2d",
    "photo-1438761681033-6461ffad8d80",
    "photo-1544005313-94ddf0286df2",
  ],
  ugc: [
    "photo-1560869713-7d0a29430803",
    "photo-1580618672591-eb180b1a973f",
    "photo-1519699047748-de8e457a634e",
    "photo-1522337360788-8b13dee7a37e",
  ],
};

export const VIDEO_SRC = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
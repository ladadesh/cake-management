export type UserRole = "admin" | "staff" | "delivery" | "chef";

export const ROLE_PAGES: Record<UserRole, string[]> = {
  admin: ["/", "/slip-list", "/users", "/upload-slip", "/delivery"],
  staff: ["/", "/upload-slip", "/slip-list"],
  delivery: ["/", "/delivery"],
  chef: ["/", "/slip-list"],
};

export const branches = [
  { id: "khamla", name: "Khamla" },
  { id: "sakkardara", name: "Sakkardara" },
  { id: "dharampeth", name: "Dharampeth" },
];

export const deliveryTypes = [
  { id: "delivery", name: "Delivery" },
  { id: "pickup", name: "Pick Up" },
];

export const cakeTypes = [
  { id: "cream", name: "Cream" },
  { id: "fondant", name: "Fondant" },
  { id: "semi-fondant", name: "Semi Fondant" },
  { id: "other", name: "Other" },
];

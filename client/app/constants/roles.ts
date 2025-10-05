export type UserRole = "admin" | "staff" | "delivery";

export const ROLE_PAGES: Record<UserRole, string[]> = {
  admin: ["/", "/orders", "/users", "/upload-slip"],
  staff: ["/", "/upload-slip", "/slip-list"],
  delivery: ["/", "/delivery"],
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

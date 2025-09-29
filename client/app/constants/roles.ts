export type UserRole = "superuser" | "owner" | "employee" | "delivery";

export const ROLE_PAGES: Record<UserRole, string[]> = {
  superuser: [
    "/",
    "/place-order",
    "/orders",
    "/admin",
    "/users",
    "/upload-slip",
  ],
  owner: ["/", "/place-order", "/orders", "/users", "/upload-slip"],
  employee: ["/", "/upload-slip", "/slip-list"],
  delivery: ["/", "/orders", "/upload-slip"],
};

export const branches = [
  { id: "khamla", name: "Khamla" },
  { id: "sakkardara", name: "Sakkardara" },
  { id: "dharampeth", name: "Dharampeth" },
  { id: "kapilNagar", name: "Kapil Nagar" },
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

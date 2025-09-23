import { UserRole } from "../constants/roles";

export const useUser = () => {
  // Simulate login role
  const user = {
    name: "Adesh",
    role: "employee" as UserRole,
  };

  return user;
};

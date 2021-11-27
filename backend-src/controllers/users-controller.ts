import { User } from "../models/users";

async function getUserById(id: number) {
  const user = await User.findOne({ where: { id } });
  return user;
}

export { getUserById };

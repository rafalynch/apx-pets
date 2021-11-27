import { User } from "./users";
import { Auth } from "./auth";
import { Pet } from "./pets";

User.hasOne(Auth);
Auth.belongsTo(User);

User.hasMany(Pet);
Pet.belongsTo(User);

export { User, Auth, Pet };

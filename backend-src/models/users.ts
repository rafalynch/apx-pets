import { sequelize } from ".";
import { Model, DataTypes } from "sequelize";

class User extends Model {}
User.init(
  {
    email: DataTypes.STRING,
    fullName: DataTypes.STRING,
  },
  { sequelize, modelName: "User" }
);

export { User };

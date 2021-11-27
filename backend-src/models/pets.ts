import { sequelize } from ".";
import { Model, DataTypes } from "sequelize";

class Pet extends Model {}
Pet.init(
  {
    name: DataTypes.STRING,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    city: DataTypes.STRING,
    region: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    isFound: DataTypes.BOOLEAN,
    contact: DataTypes.STRING,
  },
  { sequelize, modelName: "Pet" }
);

export { Pet };

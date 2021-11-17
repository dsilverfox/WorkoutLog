const { DataTypes } = require("sequelize");
const db = require("../db");

const User = db.define("user", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    required: true,
    unique: true,
  },
  passwordhash: {
    type: DataTypes.STRING,
    allowNull: false,
    required: true
  },
});

module.exports = User;

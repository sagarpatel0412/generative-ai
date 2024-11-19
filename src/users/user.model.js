const { DataTypes } = require('sequelize');
const { sequelize } = require('../../sequelize');

const crypto = require('crypto')

function hashPassword(password) {
  return crypto
      .createHash('sha256')
      .update(`${password}${process.env.SALT}`)
      .digest('base64');
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

const UsersModel = sequelize.define(
  'users',
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'username'
    },
    firstname: {
      type: DataTypes.STRING,
    },
    lastname: {
      type: DataTypes.STRING,
    },
    address1: {
      type: DataTypes.STRING,
    },
    address2: {
      type: DataTypes.STRING,
    },
    state: {
      type: DataTypes.STRING,
    },
    country: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    deletedAt: 'deleted_at',
    hooks: {
      beforeCreate: async (user) => {
        user.email = normalizeEmail(user.email)
        user.password = hashPassword(user.password);
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = hashPassword(user.password);
        }
      },
    },
  }
);

module.exports = { UsersModel };

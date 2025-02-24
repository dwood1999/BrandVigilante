import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../database';
import argon2 from 'argon2';

class User extends Model {
  public id!: number;
  public email!: string;
  public phone!: string;
  public password!: string;
  public role!: 'user' | 'admin';
}

User.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.enum(['user', 'admin']), defaultValue: 'user' },
}, { sequelize, modelName: 'User' });

User.beforeSave(async (user) => {
  if (user.changed('password')) {
    user.password = await argon2.hash(user.password);
  }
});

import { Model, DataTypes, Sequelize } from "sequelize";

export class UserWallets extends Model {
  public id!: number;
  public user_id!: number;
  public wallet!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const create = (sequelize: Sequelize) => UserWallets.init({
  user_id: {
    type: DataTypes.INTEGER,
    references: { model: 'users', key: 'id' }
  },
  wallet: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'UserWallets',
  sequelize: sequelize, // this bit is important
});

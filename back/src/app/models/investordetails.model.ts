import { Model, DataTypes, Sequelize } from "sequelize";

export class InvestorDetail extends Model {
    public id!: number;
    public user_id!: number;
    public references!: string;
    public investor_name!: string;
    public investor_telegram_id!: string;
    public investor_country!: string;
    public investor_commitment_amount!: string;
    public investor_wallet_address!: string;
    public investor_email!: string;
    public investor_fund_name!: string;
    public investor_fund_website!: string;
    public reviewed!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}
export const create = (sequelize: Sequelize) => InvestorDetail.init({
    user_id: {
        type: DataTypes.INTEGER,
        references: { model: 'users', key: 'id' }
    },
    investor_name: {
        type: DataTypes.STRING
    },
    investor_telegram_id: {
        type: DataTypes.STRING
    },
    investor_country: {
        type: DataTypes.STRING
    },
    investor_commitment_amount: {
        type: DataTypes.STRING
    },
    investor_wallet_address: {
        type: DataTypes.STRING
    },
    investor_email: {
        type: DataTypes.STRING
    },
    investor_fund_name: {
        type: DataTypes.STRING
    },
    investor_fund_website: {
        type: DataTypes.STRING
    },
    reviewed: {
        type: DataTypes.BOOLEAN
    }
}, {
    tableName: 'investorDetails',
    sequelize: sequelize, // this bit is important
});
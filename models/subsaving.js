'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class SubSaving extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	SubSaving.init(
		{
			main_savings_id: {
				type: DataTypes.INTEGER,
				onDelete: 'CASCADE',
				references: {
					model: 'savings',
					key: 'id'
				}
			},
			sub_savings_id: {
				type: DataTypes.INTEGER,
				onDelete: 'CASCADE',
				references: {
					model: 'savings',
					key: 'id'
				}
			}
		},
		{
			sequelize,
			modelName: 'SubSaving',
			tableName: 'sub_savings'
		}
	);
	return SubSaving;
};

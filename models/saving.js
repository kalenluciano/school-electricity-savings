'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Saving extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			Saving.belongsToMany(models.Saving, {
				through: models.SubSaving,
				as: 'main_savings',
				foreignKey: 'main_savings_id'
			});
			Saving.belongsToMany(models.Saving, {
				through: models.SubSaving,
				as: 'sub_savings',
				foreignKey: 'sub_savings_id'
			});
		}
	}
	Saving.init(
		{
			item: DataTypes.STRING,
			description: DataTypes.STRING,
			amount: DataTypes.INTEGER,
			qualifications: DataTypes.ARRAY(DataTypes.TEXT)
		},
		{
			sequelize,
			modelName: 'Saving',
			tableName: 'savings'
		}
	);
	return Saving;
};

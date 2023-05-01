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
			// define association here
		}
	}
	Saving.init(
		{
			item: DataTypes.STRING,
			description: DataTypes.STRING,
			amount: DataTypes.INTEGER,
			qualification: DataTypes.ARRAY
		},
		{
			sequelize,
			modelName: 'Saving',
			tableName: 'savings'
		}
	);
	return Saving;
};

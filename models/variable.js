'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Variable extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Variable.init(
		{
			zip_code: DataTypes.INTEGER,
			low_income: DataTypes.BOOLEAN,
			native_land: DataTypes.BOOLEAN,
			energy_community: DataTypes.BOOLEAN
		},
		{
			sequelize,
			modelName: 'Variable',
			tableName: 'variables'
		}
	);
	return Variable;
};

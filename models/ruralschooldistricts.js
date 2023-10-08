'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class RuralSchoolDistricts extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	RuralSchoolDistricts.init(
		{
			lea_id: DataTypes.STRING,
			locale: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'RuralSchoolDistricts',
			tableName: 'rural_school_districts',
		}
	);
	return RuralSchoolDistricts;
};

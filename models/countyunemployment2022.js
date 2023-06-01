'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class CountyUnemployment2022 extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	CountyUnemployment2022.init(
		{
			laus_code: DataTypes.STRING,
			state_fips_code: DataTypes.INTEGER,
			county_fips_code: DataTypes.INTEGER,
			county_name_state_abbreviation: DataTypes.STRING,
			year: DataTypes.INTEGER,
			labor_force: DataTypes.INTEGER,
			employed: DataTypes.INTEGER,
			unemployed: DataTypes.INTEGER,
			unemployment_rate: DataTypes.FLOAT
		},
		{
			sequelize,
			modelName: 'CountyUnemployment2022',
			tableName: 'county_unemployment_2022'
		}
	);
	return CountyUnemployment2022;
};

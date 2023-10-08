'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class FossilFuelEmploymentMSAs extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	FossilFuelEmploymentMSAs.init(
		{
			state_fips_code: DataTypes.INTEGER,
			county_fips_code: DataTypes.INTEGER,
			state_name: DataTypes.STRING,
			county_entity_name: DataTypes.STRING,
			msa_non_msa_code: DataTypes.INTEGER,
			msa_non_msa_name: DataTypes.STRING,
			msa_unemployment: DataTypes.BOOLEAN,
			msa_unemployment_value: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: 'FossilFuelEmploymentMSAs',
			tableName: 'fossil_fuel_employment_msas',
		}
	);
	return FossilFuelEmploymentMSAs;
};

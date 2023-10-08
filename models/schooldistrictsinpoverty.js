'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class SchoolDistrictsInPoverty extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	SchoolDistrictsInPoverty.init(
		{
			state_postal_code: DataTypes.STRING,
			state_fips_code: DataTypes.STRING,
			district_id: DataTypes.STRING,
			name: DataTypes.STRING,
			estimated_5_to_17_population: DataTypes.STRING,
			estimated_5_to_17_poverty_population: DataTypes.STRING,
			poverty_rate: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'SchoolDistrictsInPoverty',
			tableName: 'school_districts_in_poverty',
		}
	);
	return SchoolDistrictsInPoverty;
};

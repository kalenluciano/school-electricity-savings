'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class CoalMineCensusTracts extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	CoalMineCensusTracts.init(
		{
			state_name: DataTypes.STRING,
			county_entity_name: DataTypes.STRING,
			census_tract_2020_number_fips_code: DataTypes.INTEGER,
			tract_type: DataTypes.STRING
		},
		{
			sequelize,
			modelName: 'CoalMineCensusTracts',
			tableName: 'coal_mine_census_tracts'
		}
	);
	return CoalMineCensusTracts;
};

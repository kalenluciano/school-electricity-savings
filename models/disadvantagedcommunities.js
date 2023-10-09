'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class DisadvantagedCommunities extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	DisadvantagedCommunities.init(
		{
			census_tract_id_2010: DataTypes.STRING,
			county_name: DataTypes.STRING,
			state_territory: DataTypes.STRING,
			disadvantaged: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'DisadvantagedCommunities',
			tableName: 'disadvantaged_communities',
		}
	);
	return DisadvantagedCommunities;
};

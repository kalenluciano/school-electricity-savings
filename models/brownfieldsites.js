'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class BrownfieldSites extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	BrownfieldSites.init(
		{
			cleanup_name: DataTypes.STRING,
			location_address: DataTypes.STRING,
			city_name: DataTypes.STRING,
			state_code: DataTypes.STRING,
			postal_code: DataTypes.STRING,
			county_name: DataTypes.STRING,
			epa_id: DataTypes.STRING,
			latitude: { type: DataTypes.DOUBLE, allowNull: true },
			longitude: { type: DataTypes.DOUBLE, allowNull: true },
			epa_region_code: DataTypes.STRING,
			tribal_land: DataTypes.STRING
		},
		{
			sequelize,
			modelName: 'BrownfieldSites',
			tableName: 'brownfield_sites'
		}
	);
	return BrownfieldSites;
};

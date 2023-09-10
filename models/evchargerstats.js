'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class EVChargerStats extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	EVChargerStats.init(
		{
			available_grants: DataTypes.INTEGER,
			poor_air_quality_area: DataTypes.BOOLEAN,
			disadvantaged_community: DataTypes.BOOLEAN,
		},
		{
			sequelize,
			modelName: 'EVChargerStats',
			tableName: 'ev_charger_stats',
		}
	);
	return EVChargerStats;
};

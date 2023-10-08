'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class SchoolDistrictGeographies extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	SchoolDistrictGeographies.init(
		{
			lea_id: DataTypes.STRING,
			name_lea_22: DataTypes.STRING,
			tract: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'SchoolDistrictGeographies',
			tableName: 'school_district_geographies',
		}
	);
	return SchoolDistrictGeographies;
};

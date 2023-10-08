'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class SelfCertifiableDistricts extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	SelfCertifiableDistricts.init(
		{
			nces_id: DataTypes.STRING,
			district_name: DataTypes.STRING,
			city: DataTypes.STRING,
			state: DataTypes.STRING,
			region: DataTypes.INTEGER,
			district_in_saipe: DataTypes.STRING,
			large_district: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'SelfCertifiableDistricts',
			tableName: 'self_certifiable_districts',
		}
	);
	return SelfCertifiableDistricts;
};

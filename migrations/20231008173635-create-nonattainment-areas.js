'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('nonattainment_areas', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			state: {
				type: Sequelize.STRING,
			},
			st_abbr: {
				type: Sequelize.STRING,
			},
			countyname: {
				type: Sequelize.STRING,
			},
			pollutant: {
				type: Sequelize.STRING,
			},
			revoked_naaqs: {
				type: Sequelize.STRING,
			},
			area_name: {
				type: Sequelize.STRING,
			},
			split: {
				type: Sequelize.BOOLEAN,
			},
			yr2021: {
				type: Sequelize.STRING,
			},
			yr2022: {
				type: Sequelize.STRING,
			},
			yr2023: {
				type: Sequelize.STRING,
			},
			effec_rede: {
				type: Sequelize.STRING,
			},
			nonattain: {
				type: Sequelize.STRING,
			},
			class: {
				type: Sequelize.STRING,
			},
			part: {
				type: Sequelize.STRING,
			},
			population: {
				type: Sequelize.STRING,
			},
			fips_state: {
				type: Sequelize.STRING,
			},
			fips_cnty: {
				type: Sequelize.STRING,
			},
			pollorder: {
				type: Sequelize.STRING,
			},
			composid: {
				type: Sequelize.STRING,
			},
			exportdt: {
				type: Sequelize.STRING,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('nonattainment_areas');
	},
};

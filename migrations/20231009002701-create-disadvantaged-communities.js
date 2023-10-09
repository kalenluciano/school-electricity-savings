'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('disadvantaged_communities', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			census_tract_id_2010: {
				type: Sequelize.STRING,
			},
			county_name: {
				type: Sequelize.STRING,
			},
			state_territory: {
				type: Sequelize.STRING,
			},
			disadvantaged: {
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
		await queryInterface.dropTable('disadvantaged_communities');
	},
};

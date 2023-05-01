'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('sub_savings', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			main_savings_id: {
				type: Sequelize.INTEGER,
				onDelete: 'CASCADE',
				references: {
					model: 'savings',
					key: 'id'
				}
			},
			sub_savings_id: {
				type: Sequelize.INTEGER,
				onDelete: 'CASCADE',
				references: {
					model: 'savings',
					key: 'id'
				}
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('sub_savings');
	}
};

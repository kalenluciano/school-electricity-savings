'use strict';

const fs = require('fs');
const csv = require('csv-parser');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const seedData = [];

		return new Promise((resolve, reject) => {
			fs.createReadStream('data/msas_non_msas_energy_community.csv')
				.pipe(csv())
				.on('data', (row) => {
					seedData.push({
						...row,
						createdAt: new Date(),
						updatedAt: new Date()
					}); // Push each row of the CSV into the seedData array
				})
				.on('end', async () => {
					try {
						await queryInterface.bulkInsert(
							'all_msas',
							seedData,
							{}
						);
						resolve();
					} catch (error) {
						reject(error);
					}
				});
		});
	},

	async down(queryInterface, Sequelize) {
		queryInterface.bulkDelete('all_msas');
	}
};

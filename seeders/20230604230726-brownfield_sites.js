'use strict';

const fs = require('fs');
const csv = require('csv-parser');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const seedData = [];

		return new Promise((resolve, reject) => {
			fs.createReadStream('data/brownfield_sites.csv')
				.pipe(csv())
				.on('data', (row) => {
					if (row.latitude === '') {
						row.latitude = null;
					}
					if (row.longitude === '') {
						row.longitude = null;
					}
					seedData.push({
						...row,
						createdAt: new Date(),
						updatedAt: new Date()
					}); // Push each row of the CSV into the seedData array
				})
				.on('end', async () => {
					try {
						await queryInterface.bulkInsert(
							'brownfield_sites',
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
		queryInterface.bulkDelete('brownfield_sites');
	}
};

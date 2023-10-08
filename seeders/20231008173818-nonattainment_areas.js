'use strict';

const fs = require('fs');
const csv = require('csv-parser');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const seedData = [];

		return new Promise((resolve, reject) => {
			fs.createReadStream('data/nayro_county_nonattainment_areas.csv')
				.pipe(csv())
				.on('data', (row) => {
					if (row.split === 'FALSE') {
						row.split = false;
					} else if (row.split === 'TRUE') {
						row.split = true;
					} else {
						row.split = true;
					}
					seedData.push({
						...row,
						createdAt: new Date(),
						updatedAt: new Date(),
					}); // Push each row of the CSV into the seedData array
				})
				.on('end', async () => {
					try {
						await queryInterface.bulkInsert(
							'nonattainment_areas',
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
		queryInterface.bulkDelete('nonattaiment_areas');
	},
};

require('dotenv').config();
module.exports = {
	development: {
		database: 'school_electricity_savings_development',
		dialect: 'postgres'
	},
	test: {
		database: 'school_electricity_savings_test',
		dialect: 'postgres'
	},
	production: {
		use_env_variable: 'DATABASE_URL',
		dialect: 'postgres',
		dialectOptions: {
			ssl: {
				rejectUnauthorized: false,
				require: true
			}
		}
	}
};

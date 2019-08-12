module.exports = {
	apps: [{
		name: 'fastify-app',
		script: './server.min.js',
		instances: "max",
		autorestart: true,
		watch: false,
		env: {
			NODE_ENV: 'development',
			dev: true,
			heroku: false,
			staticSite: false
		},
		env_production: {
			NODE_ENV: 'production',
			dev: false,
			heroku: true,
			staticSite: false
		}
	}]
};

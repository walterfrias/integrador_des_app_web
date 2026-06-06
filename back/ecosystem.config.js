module.exports = {
  apps: [
    {
      name: 'gestion-proyectos-back',
      script: 'dist/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        DB_HOST: 'localhost',
        DB_PORT: 5432,
        DB_USER: 'postgres',
        DB_PASSWORD: 'postgres',
        DB_NAME: 'daw_db',
        DB_SSL: 'false',
        JWT_SECRET: '14f25ae7a618fd009d16dfbbc7cf6a0b9c8e1c',
        JWT_EXPIRES_IN: '8h',
        SWAGGER_HABILITADO: 'false',
      },
    },
  ],
};

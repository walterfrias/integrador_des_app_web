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
        JWT_SECRET: 'cambia_este_secreto_en_produccion',
        JWT_EXPIRES_IN: '8h',
        SWAGGER_HABILITADO: 'false',
      },
    },
  ],
};

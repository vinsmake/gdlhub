import pg from 'pg';

const config = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT, 10),
};

export const pool = new pg.Pool(config);

const connectWithRetry = async (retries = 5, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await pool.query('SELECT NOW()');
      console.log('Conexión exitosa:', res.rows[0]);
      return;
    } catch (err) {
      console.error(`Intento ${i + 1} fallido: ${err.message}`);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error('No se pudo conectar a PostgreSQL después de varios intentos.');
      }
    }
  }
};

console.log('Intentando conectar a PostgreSQL con:', config);
connectWithRetry();

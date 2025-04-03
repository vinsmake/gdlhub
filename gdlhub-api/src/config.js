import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.APIPORT || 3000;

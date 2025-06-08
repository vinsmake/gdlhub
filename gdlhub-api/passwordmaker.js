const bcrypt = await import('bcrypt');
const hash = await bcrypt.default.hash("password", 10);
console.log(hash);

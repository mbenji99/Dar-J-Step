const bcrypt = require('bcryptjs'); // Use bcryptjs if bcrypt didn't work

const password = 'testpassword';
const hashedPassword = bcrypt.hashSync(password, 10);

console.log('Hashed Password:', hashedPassword);

const isMatch = bcrypt.compareSync(password, hashedPassword);
console.log('Password Match:', isMatch);
            
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

const emails = ['programmecode8@gmail.com', 'noutchangyvana@gmail.com'];

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connecté à MongoDB');

    const User = require('./models/User');
    const result = await User.deleteMany({ email: { $in: emails } });
    console.log(`${result.deletedCount} compte(s) supprimé(s):`, emails);

    await mongoose.disconnect();
  } catch (err) {
    console.error('Erreur:', err.message);
    process.exit(1);
  }
})();

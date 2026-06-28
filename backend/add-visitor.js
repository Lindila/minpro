const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();
const User = require('./models/User');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await User.deleteOne({ email: 'visiteur@test.cm' });
    await User.create({
      prenom: 'Yvana', nom: 'VISITEUR TEST',
      email: 'visiteur@test.cm', password: 'visit123',
      role: 'visitor', isVerified: true, actif: true,
    });
    console.log('✅ Compte visiteur créé :');
    console.log('   Email : visiteur@test.cm');
    console.log('   Mot de passe : visit123');
    await mongoose.disconnect();
  } catch (err) { console.error('❌', err.message); process.exit(1); }
})();

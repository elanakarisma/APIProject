// middleware/isAdmin.js
import User from '../models/User.js';

// logika memastikan user sebagai admin atau bukan
const isAdmin = async (req, res, next) => {
  const { id: userId } = req.user;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.id !== 1) { // Sesuaikan logika admin di sini
      return res.status(403).json({ msg: 'Access forbidden: You do not have admin privileges' });
    }

    next();
  } catch (err) {
    console.error('Error verifying admin role:', err.message);
    res.status(500).send('Server error');
  }
};

export default isAdmin;

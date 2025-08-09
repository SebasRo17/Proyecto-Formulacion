const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registro de usuario
exports.register = async (req, res) => {
  try {
    // Validación defensiva del body
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        error: "Cuerpo de la solicitud inválido o ausente. Asegúrate de enviar JSON con 'Content-Type: application/json'."
      });
    }

    const { name, email, password, role, company, avatar } = req.body;

    // Validación de campos requeridos
    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Los campos name, email y password son obligatorios.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      company,
      avatar
    });
    await user.save();
    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Login de usuario
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET || 'jwtsecret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, company: user.company, avatar: user.avatar }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

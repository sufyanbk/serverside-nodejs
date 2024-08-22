const User = require('../models/users');

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'An error occurred while fetching users.' });
    }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'An error occurred while fetching the user.' });
    }
};

// Create a new user
exports.createUser = async (req, res) => {
    try {
        const { first_name, last_name, email } = req.body;
        const user = await User.create({ first_name, last_name, email });
        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'An error occurred while creating the user.' });
    }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, email } = req.body;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        user.first_name = first_name;
        user.last_name = last_name;
        user.email = email;
        await user.save();
        res.json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'An error occurred while updating the user.' });
    }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        await user.destroy();
        res.json({ message: 'User deleted successfully.' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'An error occurred while deleting the user.' });
    }
};

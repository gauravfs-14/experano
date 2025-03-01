const express = require('express');
const router = express.Router();

// Hello World route
router.get('/', (req, res) => {
    res.json({ message: 'Hello, World!' });
});

module.exports = {
    router,
    configure: (app) => {
        // Middleware to parse JSON requests
        app.use(express.json());
        app.use('/', router);
    }
};

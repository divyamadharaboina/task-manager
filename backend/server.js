require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected!');

    const app = express();
    app.use(cors());
    app.use(express.json());

    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/tasks', require('./routes/tasks'));

    app.listen(process.env.PORT, () =>
      console.log('Server running on port', process.env.PORT)
    );
  })
  .catch(err => console.error('DB error:', err));
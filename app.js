const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const isAuth = require('./middleware/is-auth');
const isAdmin = require('./middleware/is-admin');

const authRoutes = require('./routes/auth');
const candidateRoutes = require('./routes/candidate');
const districtRoutes = require('./routes/district');
const registrationRoutes = require('./routes/registration');
const electionRoutes = require('./routes/election');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(authRoutes);
app.use('/candidates', isAuth, isAdmin, candidateRoutes);
app.use('/districts', isAdmin, districtRoutes);
app.use('/registration', isAuth, isAdmin, registrationRoutes);
app.use('/elections', isAuth, isAdmin, electionRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode;
  const data = error.data;
  res.status(status).json({ data: data });
});

mongoose
  .connect(
    'mongodb://voter:vote@127.0.0.1:27017/vote-app?authSource=vote-app',
    {
      useNewUrlParser: true
    }
  )
  .then(result => {
    console.log('Connected to database');
    app.listen(3000);
  })
  .catch(err => {
    console.log('Disconnected from database');
    console.log(err);
  });

const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose
  .connect('mongodb://127.0.0.1:27017/vote-app')
  .then(result => {
    app.listen(process.env.PORT || 3000);
  })
  .catch(err => {
    console.log(err);
  });

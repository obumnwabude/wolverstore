const Logger = require('../models/logger');

exports.home = (req, res, next) => {
  res.status(200).send('server is working');
};

exports.getLogs = (req, res, next) => {
  Logger.find({}).then(logs => {
    res.format({
      'text/plain': () => res.status(200).send(logs.map(log => log.log).join(''))
    });
  }).catch(err => res.status(500).json(err));
};
"use strict";
var Components = require('./components');
var server = Components('/bots');
server.listen(process.env.PORT || 7000);

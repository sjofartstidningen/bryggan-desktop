/* eslint-disable no-native-reassign, strict */
'use strict';

global.init = Date.now();

require('dotenv').config();

require = require('esm')(module);
require('./index.js');

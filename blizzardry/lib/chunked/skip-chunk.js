'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _restructure = require('restructure');

var _restructure2 = _interopRequireDefault(_restructure);

var _chunk = require('./chunk');

var _chunk2 = _interopRequireDefault(_chunk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _chunk2.default)({
  skip: new _restructure2.default.Reserved(_restructure2.default.uint8, 'size')
});
module.exports = exports['default'];
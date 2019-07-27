'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _restructure = require('restructure');

var _restructure2 = _interopRequireDefault(_restructure);

var _entity = require('../entity');

var _entity2 = _interopRequireDefault(_entity);

var _localizedStringRef = require('../localized-string-ref');

var _localizedStringRef2 = _interopRequireDefault(_localizedStringRef);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _entity2.default)({
  id: _restructure2.default.uint32le,
  minRangeHostile: _restructure2.default.floatle,
  minRangeFriendly: _restructure2.default.floatle,
  maxRangeHostile: _restructure2.default.floatle,
  maxRangeFriendly: _restructure2.default.floatle,
  type: _restructure2.default.uint32le,
  description: _localizedStringRef2.default,
  name: _localizedStringRef2.default
});
module.exports = exports['default'];
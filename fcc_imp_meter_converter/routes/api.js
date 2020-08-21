/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {
  
  var convertHandler = new ConvertHandler();

  app.route('/api/convert')
    .get(function (req, res){
      var input = req.query.input;
      console.log(input);
      var initNum = convertHandler.getNum(input);
      var initUnit = convertHandler.getUnit(input);
      var returnNum = convertHandler.convert(initNum, initUnit);
      var returnUnit = convertHandler.getReturnUnit(initUnit);
      var toString = convertHandler.getString(initNum, initUnit, returnNum, returnUnit);
      
      
      if (initNum == 'invalid number') {
        if (initUnit == 'invalid unit') {
          res
            .status(400)
            .json({error: 'invalid number and unit'});
        }
        else {
          res
            .status(400)
            .json({error: 'invalid number'});
        }
      }
      else {
        if (initUnit == 'invalid unit') {
          res
            .status(400)
            .json({error: 'invalid unit'});
        }
        else {
          res.json({initNum: initNum, initUnit: initUnit, 
                    returnNum: returnNum, returnUnit: returnUnit, 
                    string: toString});
        }
      }
      
      
    });
    
};

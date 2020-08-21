/*
*
*
*       Complete the handler logic below
*       
*       
*/

function ConvertHandler() {
  
  this.xindex = (input) => {
    let regg = /[a-zA-Z]/;
    var idd = input.match(regg);
    //console.log(idd);
    return idd ? idd.index : 0;
  };
  
  this.getNum = function(input) {
    var result;
    result = input.slice(0, this.xindex(input));
    console.log(result);
    console.log(Number.parseFloat(result));
    if (result == '') {
      result = 1;
    }
    if (Number.isNaN(Number.parseFloat(result))) {
      result = 'invalid number';
    }
    //console.log(result);
    return Number.parseFloat(result);
  };
  
  this.getUnit = function(input) {
    var result;
    const validInput = ['gal','l','mi','km','lbs','kg','GAL','L','MI','KM','LBS','KG'];
    result = input.slice(this.xindex(input));
    if (!validInput.includes(result)) {
      result = 'invalid unit';
    }
    //console.log(result);
    return result;
  };
  
  this.getReturnUnit = function(initUnit) {
    var result;
    
    const dicts = {gal: 'L', GAL: 'L', L: 'gal', l:'gal',
                  mi: 'km', 'MI': 'km', km: 'mi', KM: 'mi',
                  lbs: 'kg', LBS: 'kg', kg: 'lbs', KG: 'lbs'};
    
    if (initUnit == 'invalid unit') {
      return 'invalid unit';
    }
    else {
      result = dicts[initUnit];
      console.log(result);
      return result;
    }
    
  };

  this.spellOutUnit = function(unit) {
    var result;
    //console.log(unit);
    var lUnit = unit.toLowerCase();
    var dicts = {
      mi: 'mile',
      km: 'kilometer',
      L: 'liter',
      gal: 'gallon',
      lbs: 'pound',
      kg: 'kilogram'
    };
    result = dicts[lUnit];
    return result;
  };
  
  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    var result;
    
    switch (initUnit) {
      case 'mi':
        result = initNum * miToKm;
        break;
      case 'km':
        result = initNum / miToKm;
        break;
      case 'gal':
        result = initNum * galToL;
        break;
      case 'L':
        result = initNum / galToL;
        break;
      case 'lbs':
        result = initNum * lbsToKg;
        break;
      case 'kg':
        result = initNum / lbsToKg;
        break;
      default:
        result = 0;
    }
      
    
    return result;
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    var result;
    var initS = false;
    var returnS = false;
    if (initNum != 1.00) {
      //console.log('init unit is not 1');
      initS = true;
    }
    if (returnNum != 1) {
      returnS = true;
    }
    
    result = initNum.toFixed(5) + ' ' + this.spellOutUnit(initUnit) + (initS ? 's' : '') + ' '
      + 'converts to ' + returnNum.toFixed(5) + ' ' 
      + this.spellOutUnit(returnUnit) + (returnS ? 's' : '');
    console.log(result);
    
    return result;
  };
  
}

module.exports = ConvertHandler;

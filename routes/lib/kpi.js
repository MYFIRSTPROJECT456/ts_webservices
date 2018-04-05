


function Screenfield() { 
  var _totalunits = 0;
  var _totalusers = 0;
  var _tickets = 0;
  var _recievables = 0;
  var _payables = 0;
  var _approval = 0;
  var _kpicount = 0;


  Object.defineProperty(this,"approval",{
    get: function() { return _approval; },
    set: function(value) { _approval = value;},
    enumerable: true
  }); 

  Object.defineProperty(this,"kpicount",{
    get: function() { return _kpicount; },
    set: function(value) { _kpicount = value;},
    enumerable: true
  }); 


  Object.defineProperty(this,"units",{
    get: function() { return _totalunits; },
    set: function(value) { _totalunits = value;},
    enumerable: true
  });

  Object.defineProperty(this,"users",{
    get: function() { return _totalusers; },
    set: function(value) { _totalusers = value;},
    enumerable: true
  });

  Object.defineProperty(this,"tickets",{
    get: function() { return _tickets; },
    set: function(value) { _tickets = value;},
    enumerable: true
  });
  Object.defineProperty(this,"recievables",{
    get: function() { return _recievables; },
    set: function(value) { _recievables = value;},
    enumerable: true
  });
  Object.defineProperty(this,"payables",{
    get: function() { return _payables; },
    set: function(value) { _payables = value;},
    enumerable: true
  });
}

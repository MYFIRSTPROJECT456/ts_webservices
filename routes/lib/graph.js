


function Screenfield() { 
  var _collection = 0;
  var _payment = 0;
  var _consumption = 0;
  var _status = 0;
  var _count = 0;

  Object.defineProperty(this,"collection",{
    get: function() { return _collection; },
    set: function(value) { _collection = value;},
    enumerable: true
  }); 

  Object.defineProperty(this,"payment",{
    get: function() { return _payment; },
    set: function(value) { _payment = value;},
    enumerable: true
  });

  Object.defineProperty(this,"consumption",{
    get: function() { return _consumption; },
    set: function(value) { _consumption = value;},
    enumerable: true
  });

  Object.defineProperty(this,"status",{
    get: function() { return _status; },
    set: function(value) { _status = value;},
    enumerable: true
  });

  Object.defineProperty(this,"count",{
    get: function() { return _count; },
    set: function(value) { _count = value;},
    enumerable: true
  });
}

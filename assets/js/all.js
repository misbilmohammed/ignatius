"use strict";
(function() {
  var arabicInput = document.getElementById("arabicInput");
  var arabicInputErr = document.getElementById("arabicInputErr");
  var romanInput = document.getElementById("romanInput");
  var romanInputErr = document.getElementById("romanInputErr");

  arabicInput.addEventListener("input", onInputChange);
  arabicInput.addEventListener("propertychange", onInputChange);
  romanInput.addEventListener("input", onInputChange);
  romanInput.addEventListener("propertychange", onInputChange);
  
 // Base roman numeral symbols
  var baseSyms = "IVXLCDM";
  var base = [
  {sym: baseSyms[0], val: 1},
  {sym: baseSyms[1], val: 5},
  {sym: baseSyms[2], val: 10},
  {sym: baseSyms[3], val: 50},
  {sym: baseSyms[4], val: 100},
  {sym: baseSyms[5], val: 500},
  {sym: baseSyms[6], val: 1000}
  ];
  var oLine = "\u0305";

  // Create rest of symbols
  for (var f = 1, g = base.length; f < g; f++) {
    base.push({sym: base[f].sym + oLine, val: base[f].val * 1000});
  }

  var baseLen = base.length;

  // On input changes
  function onInputChange(numSystem) {
    if(this.id === "arabicInput") {
      var arabicInputVal = arabicInput.value.trim();
      romanInput.value = "";
      romanInputErr.textContent = "";

      if(isNumericInt(arabicInputVal)) {
        if (arabicInputVal > 0) {
          if (arabicInputVal < 4000000) {
            arabicInputErr.textContent = "";
            romanInput.value = toRoman(arabicInputVal);
          } else {
            arabicInputErr.textContent = "— < 4 million only."
          }
        }
      }
      else if (arabicInputVal === "") {
        arabicInputErr.textContent = "";
      }
      else {
        arabicInputErr.textContent = "Real numbers only.";
      }
    } else {
      var romanInputVal = romanInput.value.trim().toUpperCase();
      arabicInputErr.textContent = "";
      arabicInput.value = "";
      
      if(romanInputVal !== "") {
        var reg = new RegExp("[^" + baseSyms + oLine + "]","g");
        if(!romanInputVal.match(reg)) {
          romanInputErr.textContent = "";
          arabicInput.value = toArabic(romanInputVal);
        } else {
          romanInputErr.textContent = "Roman numerals only.";
        }
      } else {
        romanInputErr.textContent = "";
      }
    }
  }

  // Check if user input is a valid integer. *Trips up on spaces at start/end of string
  function isNumericInt(val) {
    return !isNaN(parseFloat(val)) && isFinite(val) && val.indexOf(".") === -1;
  }

  // Covert to Roman numerals
  function toRoman(stringNum) {
    // Split stringNum into an a array then change each array value type from string to number
    var numArray = stringNum.split("");
    var numArrayLen = numArray.length;

    for(var i = 0; i < numArrayLen; i++) {
      numArray[i] = parseInt(numArray[i], 10);
    }
    
    // Send number in each place value to be converted
    var convertedToRoman = "";
    for(var j = 0; j < numArrayLen; j++) {
      if(numArray[numArray.length - (j + 1)] !== 0) {
        convertedToRoman = convertToRoman(numArray[numArray.length - (j + 1)], romNumCombo(j)) + convertedToRoman;
      }
    }
    
    // Symbol combinations for each place value
    function romNumCombo(ind) {
      var combo = {};

      if(ind !== 6) {
        combo.small = base[ind * 2].sym;
        combo.large = base[(ind * 2) + 1].sym;
        combo.next = base[(ind * 2) + 2].sym;
      } else {
        combo.small = base[12].sym;
      }
      return combo;
    }
    
    // Convert number to roman numeral
    function convertToRoman(convertNum, romNumObject) {
      var a = romNumObject.small, b = romNumObject.large;
      var c = romNumObject.next, romanNum;
      
      if(convertNum < 5) {
        if(convertNum === 4) {
          romanNum = a + b;
        } else {
          romanNum = a;
          for(i = 1; i < convertNum; i++) {
            romanNum += a;
          }
        }
      } else {
        if(convertNum !== 9) {
          romanNum = b;
          for(i = 5; i < convertNum; i++) {
            romanNum += a;
          }
        } else {
          romanNum = a + c;
        }
      }
      return romanNum;
    }
    return convertedToRoman;
  }

  // Covert to Arabic numerals
  function toArabic(str) {
    var strLen = str.length;
    var strArray = [];
    var convertedToArabic = 0;

    // Create array of entered roman numerals where overlines are with owners
    for(var m = 0; m < strLen; m++) {
      if (str[m+1] !== oLine) {
        strArray.push(str[m]);
      } else {
        strArray.push(str[m] + str[m+1]);
        m++;
      }
    }

    var strArrayLen = strArray.length;

    // Calculations for arabic total of roman numerals
    for(var u = 0; u < strArrayLen; u++) {
      var firstVal = getSymVal(strArray[u]);

      if(strArray[u+1]) {
        var nextVal = getSymVal(strArray[u+1]);
        if(firstVal < nextVal) {
          convertedToArabic += nextVal - firstVal;
          u++;
        } else {
          convertedToArabic += firstVal;
        }
      } else {
        convertedToArabic += firstVal;
      }
    }

    function getSymVal(strSym) {
      for (var r = 0; r < baseLen; r++) {
        if (strSym === base[r].sym) {
          return base[r].val;
        }
      }
    }

    return convertedToArabic;
  }
})();
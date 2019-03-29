


$(document).ready(function() { 
  var chosenDate = [];
  const fp = flatpickr("#flatpickr", {
    enableTime: true,
    dateFormat: "F, d Y H:i",
      onChange: function(selectedDates, dateStr, instance) {
        console.log(selectedDates)
      }
  });
});
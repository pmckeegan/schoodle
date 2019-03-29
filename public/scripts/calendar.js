

$(document).ready(function() { 

  var dateOptions={};
  flatpickr(".flatpickr", {
    enableTime: true,
    dateFormat: "F, d Y H:i",
    onClose: function(selectedDates, dateStr, instance) {
      var id = ($(this.element).attr('id'));
      dateOptions[id]=(selectedDates[0]);
      console.log(dateOptions);
      Object.values(dateOptions);

    },
  });
  console.log(dateOptions);
});
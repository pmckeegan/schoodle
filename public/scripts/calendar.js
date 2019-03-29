

$(document).ready(function() { 

  
  var dateChoices={};

  flatpickr(".flatpickr", {
    enableTime: true,
    dateFormat: "F, d Y H:i",
    onClose: function(selectedDates) {
      var id = ($(this.element).attr('id'));
      dateChoices[id]=(selectedDates[0]);
      Object.values(dateChoices);

      
      $("#createEvent").click(function() {
        $.post("/:event_id/guest_confirmation", {dateChoices}, 
        function(data, status)
        { 
          
        }
        ajax.post
      });
    }   
  });
});
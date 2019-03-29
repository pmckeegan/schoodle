$(document).ready(function() {

    const flatpickr = require("flatpickr");
    console.log("ready")

    var basicDate = document.getElementById("#basicDate");
    
    flatpickr(element, {   
        enableTime: true,
        dateFormat: "F, d Y H:i"});
});
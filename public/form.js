var nowTemp = new Date();
var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
$(function() {
   var login =$('#login-btn'),
       signup = $('#signup-btn');

   var checkin = $( "#my_date_picker_in" ).datepicker({
        defaultDate:"05/03/2022"
    });
    
   var checkout = $( "#my_date_picker_out" ).datepicker({
        defaultDate:"05/04/2022"
    });
    var requestConfig = {
        method: 'GET',
        url: '/private'
    }

//     // manipulate for show and hide login signup  ---incomplete
// $.ajax(requestConfig).then(function (responseMessage) {
//     //for each show - create list items of link--link text is the name of the show
//     //if theres a list of shows already, best to hide the home link until it clicks on a show


//     // if link is clicked -- call the link function
//     $('button').on("click", function(event) {
//         event.preventDefault();
//         //append each list item to showList -- ajax request
//         login.show()
//         signup.show()
//         nowLinkedIsClicked(event.target);
//     });
//       //Linked Clicked
//       function nowLinkedIsClicked(link){
//         $.ajax({
//             method: "GET",
//             url: '/private'
//         }).then(function(responseMessage) {
         
//         //console.log(responseMessage.image)
//        login.hide();
//        signup.hide();
    // })}
})
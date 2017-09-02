// $('#hoverMe').hover(function () {
//     $('#tooltip').stop().fadeIn();
// }, function () {
//     $('#tooltip').stop().fadeOut();
// });

// var e = document.getElementById('parent');
// e.onmouseover = function() {
//   document.getElementById('popup').style.display = 'block';
// }
// e.onmouseout = function() {
//   document.getElementById('popup').style.display = 'none';
// }

// function moreInfo() {
//     var popup = document.getElementById("myPopup");
//     popup.classList.toggle("show");
// }

//  
$(document).ready(function(){
 $('.test').hover(function(e) {
 	console.log('hovered');
    $($(this).data("tooltip")).css({
        left: e.pageX + 1,
        top: e.pageY + 1
    }).stop().show(100);
}, function() {
    $($(this).data("tooltip")).hide();
});


})


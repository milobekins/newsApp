$(".viewNotesBtn").on("click", function() {
  var url = "/articles/" + $(this).data("id")
  $.ajax({url: url, method: "GET"}).then(function(result){
      if(result) {
        $("#notesSec").empty();
        $("#notesSec").text(result);
      }
      else {
        $("#notesSec").empty();
        $("#notesSec").text("No Notes to Display");        
      }
        $("#noteDiv").slideToggle();
  });
})
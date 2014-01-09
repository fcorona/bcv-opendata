function generateNewKey(appId){
  $.ajax({
    type: "POST",
      url: '/dev/keys/generate',
      dataType: 'json',
      async: false,
      data: '{"appId": "' + appId + '"}',
      success: function (response) {
        $('#key').html(response.key);
      }
  });
};

$('.generator').on('click', function(){
  var appId = $(this).data('appId');
  generateNewKey(appId);
  return false;
});
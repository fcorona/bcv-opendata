var configureAdmin = function(sourceId, url){

  $('button.format').on('click', function(evt){
    var target = $(evt.currentTarget);
    $('#title').html(target.data('title'));
    $('#message').html(target.data('message'));
    $('#confirm').data(sourceId, target.data(sourceId))
    $('#ModalDialog').modal();
    return false;
  });

  $('#confirm').on('click', function(evt){
    var id = $('#confirm').data(sourceId);
    url = url.replace('?', id);
    $.post(url, function(data){
      if(data.message === 'ok'){
        $('#ModalDialog').modal('hide');
        $('#allow-'+id).toggleClass('hidden class');
        $('#disallow-'+id).toggleClass('hidden class');
      }else{

      }
    })
  });
}
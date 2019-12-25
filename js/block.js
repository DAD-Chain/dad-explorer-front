/**
 * Created by C0la on 2019/8/24.
 */
init();
bindButton();
function init(){
  var block_height = window.location.search.replace('?','');
  getBlockInfo(block_height, function (res) {
    if(res.code ===0){
      const value = res.result;
      getKeepers(value.bookkeepers);
      $('#block_height').text(value.block_height);
      $('#title-height').text('#'+value.block_height);
      $('#block_time').text(calcTimeDiffer(value.block_time)+' ago ['+ getLocalTime(value.block_time)+']');
      $('#hash').text(value.block_hash);
      if(value.block_height===0){
        $('#parent_hash').text('---');
        $('#parent_hash').removeClass('clickable')
      }else{
        $('#parent_hash').text(value.prev_hash);
      }
      if(value.tx_count<2){
        $('#txns_number').text(value.tx_count + ' transaction in this block');
      }else{
        $('#txns_number').text(value.tx_count + ' transactions in this block');
      }
      $('#size').text(value.block_size);
    }else{
      notFound()
    }
  });
}

function getKeepers(data){
  if(data.length===0){
    $('#bookkeepers').append(
        '---'
    )
    return '';
  }
  var keepers = data.split('&')
  var text = '<ul>'
  keepers.map(function(value){
    text += '<li>'+value+'</li>'
  });
  text+='</ul>'
  if($(window).width()>991){
    $('#extends').height(25*keepers.length);
  }else{
    $('#extends').height(60*keepers.length);
  }

  $('#bookkeepers').append(
      text
  )
}

function bindButton(){
  var phNode = $('#parent_hash')
  phNode.on('click', function(){
    if(phNode.text()==='---')return
    window.location.href='block_en.html?'+phNode.text()
  })
}

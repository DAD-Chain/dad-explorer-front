var clipboard = new ClipboardJS('#copy_tnxid');
clipboard.on('success', function(e){
  openSuccessToast('Copied to Clipboard')
})

init();
bindButton();


function init(){
  var block_height = window.location.search.replace('?','');
  getTransactionInfo(block_height, function (res) {
    console.log(res)
    if(res.code ===0){
      const value = res.result;
      $('#tnxid').text(value.tx_hash);
      $('#hash').text(value.tx_hash);
      if(value.confirm_flag === 1){
        $('#status').text('Success');
        $('#status').addClass('success');
      }else{
        $('#status').text('Fail');
        $('#status').addClass('fail');
      }

      $('#block-height').text(value.block_height);
      $('#time').text(calcTimeDiffer(value.tx_time)+' ago'+' ['+ getLocalTime(value.tx_time)+']');

      if(value.detail.transfers && value.detail.transfers[0]){
        if(value.detail.transfers[0].from_address){
          $('#from').text(value.detail.transfers[0].from_address);
        }
        if(value.detail.transfers[0].to_address){
          $('#to').text(value.detail.transfers[0].to_address);
        }
        $('#value').text(toFixed1(value.detail.transfers[0].amount));
      }
      value.detail.transfers = undefined;

      document.getElementById('code').innerHTML = '<br>'+JSON.stringify(value.detail, null, 2)
    }else{
      notFound()
    }

  });
}

function bindButton(){
  var from = $('#from');
  from.on('click', function(){
    if(from.text()!=='---'){
      window.location.href='address_en.html?'+from.text()
    }
  });
  var to = $('#to');
  to.on('click', function(){
    if(to.text()!=='---'){
      window.location.href='address_en.html?'+to.text()
    }
  })
}

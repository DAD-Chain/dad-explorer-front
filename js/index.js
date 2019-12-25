/**
 * Created by C0la on 2019/8/24.
 */
initData();
refreshBlocks();
refreshTXN();



function initData(){
  getBlockAVGTime(function (res) {
    $('#avg-time').text(res.result +'s')
  });
  getBlockchainLatestInfo(function (res) {
    $('#node-number').text(res.result.node_count);
    $('#total-trx-number').text(res.result.tx_count);
    $('#block-height-number').text('#'+res.result.block_height);
  });
  getBlockchainTPS(function (res) {
    $('#tps-number').text(res.result.current_tps)
  });
}

function refreshBlocks(){
  getLatestBlocks(6,function (res) {
    res.result.map(function(value, index){
      $('#'+'block-height'+(index+1)).text(' #'+value.block_height);
      $('#'+'block-height'+(index+1)).attr("href", 'pages/block_en.html?'+value.block_height);
      $('#'+'block-time'+(index+1)).text(calcTimeDiffer(value.block_time)+' ago');
      $('#'+'block-txns'+(index+1)).text(' '+value.tx_count+' Txns');
    })
  });
}

function refreshTXN(){
  getLatestTransactions(6,function (res) {
    res.result.map(function(value, index){
      console.log(res)
      $('#'+'txn-id'+(index+1)).text(' '+trim(value.tx_hash));
      $('#'+'txn-id'+(index+1)).attr("href", 'pages/trx_en.html?'+value.tx_hash);
      $('#'+'txn-time'+(index+1)).text(calcTimeDiffer(value.tx_time)+' ago');
      $('#'+'from'+(index+1)).text(' '+trim(value.from_address));
      if(value.from_address){
        $('#'+'from'+(index+1)).attr("href", 'pages/address_en.html?'+value.from_address);
      }
      $('#'+'to'+(index+1)).text(' '+trim(value.to_address));
      if(value.to_address){
        $('#'+'to'+(index+1)).attr("href", 'pages/address_en.html?'+value.to_address);
      }
    })
  });
}



setInterval(function(){
  initData();
  refreshBlocks();
  refreshTXN();
}, 15000)





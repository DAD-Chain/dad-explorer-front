var clipboard = new ClipboardJS('#copy_account');
clipboard.on('success', function(e){
    openSuccessToast('Copied to Clipboard')
    // $('.toast-wrap').show();
    // setTimeout(() => {
    //     $('.toast-wrap').fadeOut('slow');
    // }, 1000);
});

var currentPage = 1;
var totalPage = 0;
var totalItem = 0;
var loadedItem = 0;
var loading = false;

Init();
bindButton();
scroll();
$('#jumpToButton').on('click', jumpToPage);

$('#jumpPage').keyup(()=>{
  if(event.key === 'Enter'){
    jumpToPage();
  }
});

function jumpToPage(){
  const value = $('#jumpPage').val();
  if(value<=totalPage && value>=1 && value !==currentPage){
    $('#jumpPage').val('');
    refreshTable(parseInt(value));
  }
}
function bindButton() {
  $('#first-page').on('click', function () {
    if (currentPage === 1)return;
    refreshTable(1);
  });
  $('#last-page').on('click', function () {
    if (currentPage >= totalPage)return;
    refreshTable(parseInt(totalPage));
  });
  $('#next-page').on('click', function () {
    if (currentPage >= totalPage)return;
    refreshTable(currentPage+1);
  });
  $('#prev-page').on('click', function () {
    if (currentPage === 1)return;
    refreshTable(currentPage-1);
  })
}

function Init() {
  var address = window.location.search.replace('?','');
  initAddress();
  $('#account_number').text(address);
  getData(function (res) {
    if(res.result.records.length > 0){
      initTable(res.result.records);
      initCard(res.result.records);
      totalPage = setTotalPage(res.result.total);
      totalItem = res.result.total;
      $('#current_page').text(currentPage);
      $('#total_page').text(totalPage);
      if(totalItem<2){
        $('#total-number').text(totalItem +' transaction in total')
      }else{
        $('#total-number').text(totalItem +' transactions in total')
      }
      if(totalItem<2){
        $('.total-txns').text(totalItem +' transaction in total')
      }else{
        $('.total-txns').text(totalItem +' transactions in total')
      }

    }else{
      // notFound()
    }
  },1)
}

function refreshTable(pageNext) {
  getData(function (res) {
    if(res.code === 0){
      totalPage = setTotalPage(res.result.total);
      totalItem = res.result.total;
      if(totalItem<2){
        $('.total-txns').text(totalItem +' transaction in total')
      }else{
        $('.total-txns').text(totalItem +' transactions in total')
      }
      $('#table-body').empty();
      initTable(res.result.records);
      currentPage = pageNext;
      $('#current_page').text(currentPage);
    }else{
      notFound()
    }
  }, pageNext);
}

function scroll() {
  if($(window).width()>991) return;

  $(window).scroll(function () {
    //下面这句主要是获取网页的总高度，主要是考虑兼容性所以把Ie支持的documentElement也写了，这个方法至少支持IE8
    var htmlHeight = $(document).height();
    //clientHeight是网页在浏览器中的可视高度，
    var clientHeight = $(window).height();
    //scrollTop滚动条到顶部的垂直高度
    var scrollTop = $(document).scrollTop();
    //通过判断滚动条的top位置与可视网页之和与整个网页的高度是否相等来决定是否加载内容；
    var he = scrollTop + clientHeight;
    if (he >= htmlHeight * 0.9) {
      refreshCard(currentPage+1);
    }
  });
}


function refreshCard(pageNext) {
  if(loadedItem>=totalItem)return;
  if(loading === true)return;
  loading = true;

  getData(function (res) {
    initCard(res.result.records);
    currentPage = pageNext;
    loading = false;
  }, pageNext);
}


function setTotalPage(total) {
  if(total<=10){
    return 1
  }
  var base = parseInt((total / 10).toFixed());
  if ((total / 10) > base) {
    return base + 1
  } else {
    return base
  }
}

function initTable(array) {
  console.log(array)
  var extendString = '';
  array.map(function (value) {
    console.log(value)
    extendString += '<tr class="table-row">' +
        '<td class="table-items align-left tx_hash clickable" data-toggle="'+value.tx_hash+'"><p>' + trim(value.tx_hash) + '</p></td>' +
        '<td class="table-items align-left"><p>' + value.block_height + '</p></td>' +
        '<td class="table-items align-center to clickable" data-toggle="'+ (value.transfers[0] != undefined ? value.transfers[0].to_address : '---')+'"><p>' + (value.transfers[0]!= undefined ? getAddress(value.transfers[0].to_address) : '---')+ '</p></td>' +
        '<td class="table-items align-center"><p>' + (value.transfers[0] ? toFixed1(value.transfers[0].amount) : '---')+ '</p></td>' +
        '<td class="table-items align-right"><p>' + getLocalTime(value.tx_time) + '</p></td>' +
        '</tr>';
  });
  $('#table-body').append(
    extendString
  );
  $('.tx_hash').on('click', function(){
    if($(this).attr('data-toggle')!=='undefined'){
      window.location.href='trx_en.html?'+$(this).attr('data-toggle')
    }

  });
  $('.to').on('click', function(){
    if($(this).attr('data-toggle')!=='undefined'){
      window.location.href='address_en.html?'+$(this).attr('data-toggle')
    }
  })
}

function getAddress(value){
  if(!value || value.length ===0){
    return '---'
  }else{
    return value
  }
}

function initCard(array) {
  var extendCard = '';
  array.map(function (value) {
    extendCard += '<div class="panel panel-default">' +
      '<div class="panel-heading special"><div class="panel-title">Height <span class="data-word">' + value.block_height + '</span>' + '</div>' +
      '<div class="more-button">value <span class="white-word">' + (value.transfers[0] ? toFixed1(value.transfers[0].amount) : '---')+ '</span></div></div>' +
      ' <div class="panel-body"><div class="Block-item">' +
      '<div class="first-line"><div>TxHash <span class="white-word tx_hash" data-toggle="'+value.tx_hash+'">' + trim(value.tx_hash) + '</span></div></div>' +
      '<div class="second-line"><div>Time <span class="white-word">' + getLocalTime(value.tx_time) + '<br></span> To <span class="white-word to" data-toggle="'+ (value.transfers[0] ?  value.transfers[0].to_address : '---')+'">'+  (value.transfers[0] ? getAddress(value.transfers[0].to_address) : '---')+'</span></div></div>' +
      '</div></div></div>' +
      '</div>'
  });

  loadedItem += array.length;
  $('#cardbody').append(
    extendCard
  )
  $('.tx_hash').on('click', function(){
    if($(this).attr('data-toggle')!=='undefined'){
      window.location.href='trx_en.html?'+$(this).attr('data-toggle')
    }
  });
  $('.to').on('click', function(){
    if($(this).attr('data-toggle')!=='undefined'){
      window.location.href='address_en.html?'+$(this).attr('data-toggle')
    }
  })
}

function getNode(data) {
  if (typeof data === 'string' || typeof data === 'number') {
    return 1
  } else {
    return data.length
  }
}

function getData(cb, pageNext) {
  var address = window.location.search.replace('?','');
  getTransactionsByAddr(address, pageNext, 10,(function (res) {
    cb(res);
  }), ()=>{
    loading = false;
  });
}

function initAddress(){
  var address = window.location.search.replace('?','');
  getBalanceByAddr(address,function (res) {
    if(res.code === 0){
      const value = res.result[0];
      $('#address').text(address);
      $('#balance').text(toFixed1(value.balance) +' '+value.asset_name.toUpperCase())
    }else{
      // notFound()
    }
  });
}

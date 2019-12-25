/**
 * Created by C0la on 2019/8/24.
 */
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
    refreshTable(currentPage -1);
  })
}


function Init() {
  getTotalNumber(()=>{
    getData(function (res) {
      initTable(res.result);
      initCard(res.result);
      totalPage = setTotalPage(totalItem);
      $('#current_page').text(currentPage);
      $('#total_page').text(totalPage);
      $('.total-number').text(totalItem);
      updateTotalTrx(totalItem);
    }, 1)
  })
}

function updateTotalTrx(totalItems)
{
  totalItem = totalItems;
  if(totalItem <= 1){
    $('.all-transactions').text(totalItems+ ' transaction in total');
  }else {
    $('.all-transactions').text(totalItems+ ' transactions in total');
  }
}

function refreshTable(pageNext) {
  getData(function (res) {
    totalPage = setTotalPage(totalItem);
    updateTotalTrx(totalItem);
    $('#total_page').text(totalPage);
    $('#table-body').empty();
    initTable(res.result);
    currentPage = pageNext;
    $('#current_page').text(currentPage);

  }, pageNext);
}

function scroll() {
  if($(window).width()>991) return;

  $(window).scroll(function () {
    var htmlHeight = $(document).height();
    var clientHeight = $(window).height();
    var scrollTop = $(document).scrollTop();
    //通过判断滚动条的top位置与可视网页之和与整个网页的高度是否相等来决定是否加载内容；
    var he = scrollTop + clientHeight;
    if (he >= htmlHeight * 0.9) {
      refreshCard();
    }
  });
}


function refreshCard() {
  if(loading === true)return
  loading = true
  if(loadedItem>=totalItem)return;
  getData(function (res) {
    initCard(res.result);
    currentPage = currentPage+1;
  }, currentPage+1);
}


function setTotalPage(total) {
  var base = parseInt((total / 10).toFixed());
  if ((total / 10) > base) {
    return base + 1
  } else {
    return base
  }
}

function initTable(array) {
  var extendString = '';
  array.map(function (value) {
    extendString += '<tr class="table-row">' +
      '<td class="table-items align-left tx_hash clickable" data-toggle="'+value.tx_hash+'"><p>' + trim(value.tx_hash) + '</p></td>' +
      '<td class="table-items align-left">' + getLocalTime(value.tx_time)+ '</td>' +
      '<td class="table-items align-center from clickable" data-toggle="'+value.from_address+'"><p>' + getAddress(value.from_address) + '</p></td>' +
      '<td class="table-items align-center to clickable" data-toggle="'+value.from_address+'"><p>' + getAddress(value.to_address) + '</p></td>' +
      '<td class="table-items align-right">' + toFixed1(value.amount) + '</td>' +
      '<td class="table-items align-right">' + value.block_height + '</td>' +
        '</tr>';
  });
  $('#table-body').append(
    extendString
  );
  $('.tx_hash').on('click', function(){
    if($(this).attr('data-toggle') !== 'undefined'){
      window.location.href='trx_en.html?'+$(this).attr('data-toggle')
    }
  });
  $('.from').on('click', function(){
    console.log($(this).attr('data-toggle'));
    if($(this).attr('data-toggle') !== 'undefined'){
      window.location.href='address_en.html?'+$(this).attr('data-toggle')
    }
  });
  $('.to').on('click', function(){
    if($(this).attr('data-toggle') !== 'undefined'){
      window.location.href='address_en.html?'+$(this).attr('data-toggle')
    }
  })
}

function getAddress(value){
  if(!value || value.length ===0){
    return '---'
  }else{
    return trim(value)
  }
}

function getMinIndex(pageNumber){
  if(totalItem - (pageNumber * 10) < 0 ){
    return 0
  }else{
    return totalItem - (pageNumber * 10)
  }
}

function getPageSize(pageNumber){
  let pageSize = 10;
  if(pageNumber == totalPage){
    pageSize = totalItem%10;
  }

  if(pageSize == 0){
    pageSize = 10;
  }
  return pageSize;
}

function initCard(array) {
  var extendCard = '';
  array.map(function (value) {
    extendCard += '<div class="panel panel-default">' +
      '<div class="panel-heading special"><div class="panel-title">Height <span class="data-word">' + value.block_height + '</span>' + '</div>' +
      '<div class="more-button">value <span class="white-word">' + toFixed1(value.amount) + '</span></div></div>' +
      ' <div class="panel-body"><div class="Block-item">' +
      '<div class="first-line"><div>TxHash <span class="white-word tx_hash" data-toggle="'+value.tx_hash+'">' + trim(value.tx_hash) + '</span></div></div>' +
      '<div class="second-line"><div>From <span class="white-word from" data-toggle="'+value.from_address+'">' + getAddress(value.from_address) + '</span> To <span class="white-word to" data-toggle="'+value.to_address+'">'+getAddress(value.to_address)+'</span></div></div>' +
      '</div></div></div>' +

      '</div>'

  });
  loadedItem += array.length;
  $('#cardbody').append(
    extendCard
  )
  $('.tx_hash').on('click', function(){
    if($(this).attr('data-toggle') !== 'undefined'){
      window.location.href='trx_en.html?'+$(this).attr('data-toggle')
    }
  });
  $('.from').on('click', function(){
    if($(this).attr('data-toggle') !== 'undefined'){
      window.location.href='address_en.html?'+$(this).attr('data-toggle')
    }
  });
  $('.to').on('click', function(){
    console.log($(this).attr('data-toggle'));
    if($(this).attr('data-toggle') !== 'undefined'){
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
  getTransactions(getMinIndex(pageNext), getPageSize(pageNext), (function (res) {
    console.log(res)
    cb(res);
    loading = false;
  }), (error)=>{
    console.log(error)
    loading = false;
  });
}

function getTotalNumber(cb){
  getBlockchainLatestInfo((res)=>{
    totalItem = res.result.tx_count;
    cb();
  })
}


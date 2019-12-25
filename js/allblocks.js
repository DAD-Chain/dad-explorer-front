var currentPage = 1;
var totalPage = 0;
var totalItem = 0;
var loadedItem = 0;
var loading = false;
Init();
bindButton();
scroll();
$('#jumpToButton').on('click', jumpToPage);

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
  getTotalNumber(()=>{
    getData(function (res) {
      initTable(res.result.records);
      initCard(res.result.records);
      totalPage = setTotalPage(res.result.total);
      $('#current_page').text(currentPage);
      $('#total_page').text(totalPage);
      totalItem = res.result.total;
      // $('.total-number').text(totalItem)
      updateTotalBlock(totalItem);
    }, 1)
  });
}

function updateTotalBlock(totalItems) {
  totalItem = totalItems;
  if(totalItem <= 1){
    $('.all-transactions').text(totalItem+ ' block in total');
  }else {
    $('.all-transactions').text(totalItem+ ' blocks in total');
  }
}

function refreshTable(pageNext) {
  getData(function (res) {
    totalPage = setTotalPage(res.result.total);
    $('#total_page').text(totalPage);
    updateTotalBlock(res.result.total);

    $('#table-body').empty();
    initTable(res.result.records);
    currentPage = pageNext;
    $('#current_page').text(currentPage);
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
      refreshCard();
    }
  });
}

function jumpToPage(){
  const value = $('#jumpPage').val();
  if(value<=totalPage && value>=1 && value !==currentPage){
    $('#jumpPage').val('');
    refreshTable(parseInt(value));
  }
}

$('#jumpPage').keyup(()=>{
  if(event.key === 'Enter'){
    jumpToPage();
  }
});


function refreshCard() {
  if(loading === true)return
  loading = true
  if(loadedItem>=totalItem)return;
  getData(function (res) {
    initCard(res.result.records);
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
      '<td class="table-items align-left clickable height" data-toggle="'+value.block_height+'">' + value.block_height + '</td>' +
      '<td class="table-items align-left">' + getLocalTime(value.block_time) + '</td>' +
      '<td class="table-items align-center">' + value.tx_count + '</td>' +
      '<td class="table-items align-center">' + getNode(value.bookkeepers) + '</td>' +
      '<td class="table-items align-right">' + value.block_size + '</td>' + +
        '</tr>';
  });
  $('#table-body').append(
    extendString
  );
  // $('.height').on('click', function(){
  //   window.location.href='block_en.html?'+$('.height').attr('data-toggle')
  // });
  $('.height').on('click', function(){
    window.location.href='block_en.html?'+$(this).attr('data-toggle')
  });
}

function initCard(array) {
  var extendCard = '';
  array.map(function (value) {
    extendCard += '<div class="panel panel-default">' +
      '<div class="panel-heading special"><div class="panel-title">Height <span class="data-word height1" data-toggle="'+value.block_height+'">' + value.block_height + '</span>' + '</div>' +
      '<div class="more-button"><span class="white-word">' + getLocalTime(value.block_time) + '</span></div></div>' +
      ' <div class="panel-body"><div class="Block-item">' +
      '<div class="first-line"><div><span class="white-word">' + value.tx_count + '</span> Txs</div><div>Size(Byte) <span class="white-word"> ' + value.block_size + '</span></div></div>' +
      '<div class="second-line"><div>BookKeepers <span class="white-word">' + getNode(value.bookkeepers) + '</span></div></div>' +
      '</div></div></div>' +

      '</div>'

  });
  loadedItem += array.length;
  $('#cardbody').append(
    extendCard
  )
  $('.height1').on('click', function(){
    window.location.href='block_en.html?'+$(this).attr('data-toggle')
  });
}

function getNode(data) {
  return data.split('&').length;
}

function getData(cb,pageNext) {
  getBlocksV2(getMinIndex(pageNext), getPageSize(pageNext),
    (function (res) {
        cb(res)
        loading = false;
    }),
    ()=>{
      loading = false;
    });
}

function getTotalNumber(cb){
  getBlockchainLatestInfo((res)=>{
    console.log(res);
    totalItem = res.result.block_height;
    cb();
  })
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



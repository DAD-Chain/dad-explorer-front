var currentPage = 1;
var totalPage = 0;
var totalItem = 0;
var loadedItem = 0;
var loading = false;
var selectType = 'Click'
var indexForCard1 = 0;
var indexForCard2 = 0;
var lastPage =false;
const luckyBoxHref = 'http://172.20.120.35:8084/'


init();

function init(){
    initSelector();
    bindButton();
    scroll();
    initData();
}

function initData(){
    getData(function(res){
        let data = res.result;

        totalPage = data.total_page;
        lastPage = data.last_page;
        $('#total_page').text(totalPage);
        console.log(data)
        initTop(data.top.src[0], data.top.link);
        initTable(data.ad_list);
        appendCard(data.ad_list);
        $('#cardBody').empty();
        currentPage = 1;
        if(data.total_page === 0){
            $('#current_page').text(0)
        }else{
            $('#current_page').text(currentPage);
        }

    },1, selectType);
}


function initTable(array){
    var extendString = '';

    array.map(function(value, index){
        let leftOrRight;
        if(index%2==0){
            leftOrRight = 'left-wall-call'
        }else{
            leftOrRight = 'right-wall-cell'
        }


        extendString+='<div id="'+'tablePanel' + index+'" data-toggle="'+value.link+'" class="col-xs-12 col-sm-6 col-md-4 adsWallCell '+leftOrRight+'">\n' +
            '                    <a >\n' +
            '                        <div class="adsWallPanel">\n' +
            '                            <img class="adsWallImage" src="'+value.src[0]+'">\n' +
            '                            <div class="adsWallTitle">\n' +
            '                                '+value.title+'\n' +
            '                            </div>\n' +
            '                            <div class="adsWallWord">\n' +
            '                                <p class="adsWallExpireTime">End time: '+getLocalTime(value.end)+'</p>\n' +
            '                                <p class="adsWallPercent">'+parseInt(value.progress * 100)+'%</p>\n' +
            '                            </div>\n' +
            '                            <div class="progress adsWallProgress">\n' +
            '                                <div class="progress-bar" role="progressbar" aria-valuenow="60"\n' +
            '                                     aria-valuemin="0" aria-valuemax="100" style="width: '+parseInt(value.progress * 100)+'%;">\n' +
            '                                    <span class="sr-only">'+parseInt(value.progress * 100)+'%</span>\n' +
            '                                </div>\n' +
            '                            </div>\n' +
            '                        </div>\n' +
            '                    </a>\n' +
            '                </div>'
    })

    $('#gridBody').empty();
    $('#gridBody').append(
        extendString
    );
    array.map(function(value,index){
        initPanelClick('tablePanel'+index)
    })
}

function appendCard(array){
    var extendString = '';

    array.map(function(value, index){
        let leftOrRight;
        if(indexForCard1%2==0){
            leftOrRight = 'left-wall-call'
        }else{
            leftOrRight = 'right-wall-cell'
        }


        extendString+='<div id="'+'cardPanel' + indexForCard1+'" data-toggle="'+value.link+'" class="col-xs-12 col-sm-6 col-md-4 adsWallCell '+leftOrRight+'">\n' +
            '                    <a>\n' +
            '                        <div class="adsWallPanel">\n' +
            '                            <img class="adsWallImage" src="'+value.src[0]+'">\n' +
            '                            <div class="adsWallTitle">\n' +
            '                                '+value.title+'\n' +
            '                            </div>\n' +
            '                            <div class="adsWallWord">\n' +
            '                                <p class="adsWallExpireTime">End time: '+getLocalTime(value.end)+'</p>\n' +
            '                                <p class="adsWallPercent">'+parseInt(value.progress * 100)+'%</p>\n' +
            '                            </div>\n' +
            '                            <div class="progress adsWallProgress">\n' +
            '                                <div class="progress-bar" role="progressbar" aria-valuenow="60"\n' +
            '                                     aria-valuemin="0" aria-valuemax="100" style="width: '+parseInt(value.progress * 100)+'%;">\n' +
            '                                    <span class="sr-only">'+parseInt(value.progress * 100)+'%</span>\n' +
            '                                </div>\n' +
            '                            </div>\n' +
            '                        </div>\n' +
            '                    </a>\n' +
            '                </div>'
        indexForCard1++

    })
    $('#cardBody').append(
        extendString
    );
    array.map(function(){
        initPanelClick('cardPanel'+indexForCard2)
        indexForCard2++
    })
}

function initTop(src, href){
    $('#topHref').attr('href',luckyBoxHref);
    $('#topImage').attr('src',src);
    $('#top1').attr('src', '../img/top1.jpg')
    $('#top2').attr('src', '../img/top2.jpg')
    $('#top3').attr('src', '../img/top3.jpeg')
    $('#top4').attr('src', '../img/top4.jpg')
}

//状态选择器
function initSelector(){
    $('#selectWatch').on('click', function(){
        handleSelection($(this).text());
    });
    $('#selectClick').on('click', function(){
        handleSelection($(this).text());
    });
    $('#selectInstall').on('click', function(){
        handleSelection($(this).text());
    });
    $('#selectRegister').on('click', function(){
        handleSelection($(this).text());
    });
    $('#selectOther').on('click', function(){
        handleSelection($(this).text());
    });

    function handleSelection(index){
        if(selectType === index)return;
        selectType = index;
        $('#indicator').text(index);
        initData();
    }

}

function initPanelClick(index){
    $('#'+index).off('click');
    $('#'+index).on('click', function(){
        if(!sessionStorage.getItem('address')){
            openWarnModal('Operation failed! You need to log in before conducting tasks!');
            return
        }
        let herf = $(this).data('toggle');
        window.open(luckyBoxHref)
    })
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
    $('#jumpToButton').on('click', jumpToPage);
}

function refreshTable(pageNext) {
    getData(function (res) {
        let data = res.result;
        totalPage = data.total_page;
        $('#total_page').text(totalPage);
        initTable(data.ad_list);
        currentPage = pageNext;
        $('#current_page').text(currentPage);
    }, pageNext, selectType);
}

function refreshCard() {
    if(loading === true)return;
    loading = true;
    if(lastPage)return;
    getData(function (res) {
        let data = res.result;
        lastPage = data.last_page;
        appendCard(data.ad_list);
        currentPage = currentPage+1;
    }, currentPage+1, selectType);
}


function getData(cb,pageNext,type) {
    getWallInfo(pageNext, 6, type,
        (function (res) {
            cb(res)
            loading = false;
        }),
        ()=>{
            loading = false;
        });
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

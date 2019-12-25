var mockData = [
    {
        "action": 'Click',
        "action_time": 1570706411,
        "campaign_id": 823423,
        "tx_hash":823423,
        "campaign_name": "string",
        "collect_status": "TO_BE_COLLECTEDT",
        "create_time": 0,
        "end_time": 1570706411,
        "expire": 0,
        "last_modify": 0,
        "revenue": 0.5,
    },
    {
        "action": 'Click',
        "action_time": 1570706411,
        "campaign_id": 923423,
        "tx_hash":923423,
        "campaign_name": "string",
        "collect_status": "TO_BE_COLLECTEDT",
        "create_time": 0,
        "end_time": 1570706411,
        "expire": 0,
        "last_modify": 0,
        "revenue": 0.5,
    },
    {
        "action": 'Click',
        "action_time": 1570706411,
        "campaign_id": 723423,
        "campaign_name": "string",
        "collect_status": "TO_BE_COLLECTEDT",
        "create_time": 0,
        "end_time": 1570706411,
        "expire": 0,
        "last_modify": 0,
        "revenue": 0.5,
    }
]
var currentPage = 1;
var totalPage = 0;

var loadedItem = 0;
var loading = false;
var selectType = 'All'
var indexForCard1 = 0;
var lastPage =false;
var indexForCard2 = 0;
init();

function initData(){

    getData(function (res) {
        let data = res.result;
        initRevenusStatus(data.accumulated_revenue, data.revenue_to_be_collected);
        totalPage = data.total_page;
        $('#total_page').text(totalPage);

        $('#cardbody').empty();
        initTable(data.awards_list);
        appendCard(data.awards_list);
        currentPage = 1;
        $('#current_page').text(currentPage);
    }, 1, selectType);
}

function init(){

    initSelector();
    scroll();
    bindButton();
    initData();
}

function initRevenusStatus(accumulated_revenue, revenue_to_be_collected){
    $('#accumulated-data').text((accumulated_revenue / 1000000000).toFixed(2) + ' DAD');
    $('#tobe-data').text((revenue_to_be_collected / 1000000000).toFixed(2) + ' DAD');
}

//设置表格数据
function initTable(array) {
    var extendString = '';

    array.map(function (value, index) {
        let buttonStyle = 'collectButton';
        if(value.collect_status !== 'TO_BE_COLLECTEDT'){
            buttonStyle +=' hide'
        }
        extendString += '<tr class="table-row">\n' +
            '                            <td class="table-items align-left clickable height">\n' +
            '                                <a href="../pages/trx_en.html?'+value.tx_hash+'">'+trim(value.campaign_id)+'</a>\n' +
            '                            </td>\n' +
            '                            <td class="table-items align-left specialCell">\n' +
            '                                '+value.campaign_name+'\n' +
            '                            </td>\n' +
            '                            <td class="table-items align-left">\n' +
            '                                '+splitTime(getLocalTime(value.end_time/1000))+
            '                            </td>\n' +
            '                            <td class="table-items align-left actionCell">\n' +
            '                                '+value.action+'\n' +
            '                            </td>\n' +
            '                            <td class="table-items align-left">\n' +
            '                                '+splitTime(getLocalTime(value.action_time/1000))+
            '                            </td>\n' +
            '                            <td class="table-items align-left">\n' +
            '                                '+getStatus(value.collect_status)+'\n' +
            '                            </td>\n' +
            '                            <td class="table-items align-left">\n' +
            '                                <div class="revenue">\n' +
            '                                    <p>'+(value.revenue/1000000000).toFixed(2)+' DAD</p>\n' +
            '                                    <div id="TableBtn'+index+'" class="'+buttonStyle+'" data-toggle="'+value.tx_hash+'">Claim</div>\n' +
            '                                </div>\n' +
            '\n' +
            '                            </td>\n' +
            '                        </tr>'

    });
    $('#table-body').empty();
    $('#table-body').append(
        extendString
    );
    array.map(function (value, index){
        initCollectButton('TableBtn'+index);
    })
}

//设置卡片数据（小屏幕使用）
function appendCard(array){
    var extendString = '';
    array.map(function (value, index) {
        let buttonStyle = 'collectButton';
        if(value.collect_status !== 'TO_BE_COLLECTEDT'){
            buttonStyle +=' hide'
        }
        extendString += '<div class="panel panel-default">\n' +
            '                        <div class="panel-heading special">\n' +
            '                            <div class="panel-title">\n' +
            '                                Campaign ID\n' +
            '                                <span class="data-word height1">\n' +
            '                                    <a href="../pages/trx_en.html?'+value.tx_hash+'">'+value.campaign_id+'</a>\n' +
            '                                </span>\n' +
            '                            </div>\n' +
            '                        </div>\n' +
            '                        <div class="panel-body">\n' +
            '                            <div class="Block-item">\n' +
            '                                <div class="first-line">\n' +
            '                                    <div>Campaign Name <span class="white-word">'+value.campaign_name+'</span></div>\n' +
            '                                    <div>End Time <span class="white-word">'+getLocalTime(value.end_time/1000)+'</span></div>\n' +
            '                                </div>\n' +
            '                                <div class="second-line">\n' +
            '                                    <div>Action <span class="white-word">'+value.action+'</span></div>\n' +
            '                                    <div>Action Time <span class="white-word">'+getLocalTime(value.action_time/1000)+'</span></div>\n' +
            '                                </div>\n' +
            '                                <div class="second-line">\n' +
            '                                    <div>Status <span class="white-word" id="cardState'+indexForCard1+'">'+getStatus(value.collect_status)+'</span></div>\n' +
            '                                </div>\n' +
            '                                <div class="second-line">\n' +
            '                                    <div>Revenue\n' +
            '                                        <div class="revenue">\n' +
            '                                        <p>'+(value.revenue / 1000000000).toFixed(2)+' DAD</p>\n' +
            '\n' +
            '                                        </div>\n' +
            '                                    </div>\n' +
            '                                    <div class="'+buttonStyle+'" id="CardBtn_'+indexForCard1+'" data-toggle="'+value.tx_hash+'">Claim</div>\n' +
            '                                </div>\n' +
            '                            </div>\n' +
            '                        </div>\n' +
            '                    </div>'
        indexForCard1++;
    })
    $('#cardbody').append(
        extendString
    );
    loadedItem += array.length;
    array.map(()=>{
        initCollectButton('CardBtn_'+indexForCard2);
        indexForCard2++;
    })

}

function splitTime(inputTime){
    let date = inputTime.substring(0,10)
    let time = inputTime.substring(11)
    return date+'</br>'+time
}

function getStatus(status){
    switch (status) {
        case 'TO_BE_COLLECTEDT':
            return 'To be claimed'
        case 'COLLECTED':
            return 'Claimed'
        case 'EXPIRED':
            return 'Expired'
    }
}

//collect按钮事件绑定
function initCollectButton(index){
    if(!index)return;
    $('#'+index).off('click');
    $('#'+index).on('click', function(){
        // openLoading()
        let hash = $(this).data('toggle');
        let address = sessionStorage.getItem("address");

        //double check that address is login or not
        dapiLogin((addr) => {
            if (addr === address) { // Same address, ok, go to claim revenue
                claimAward(address, hash, function (res) {
                    // closeLoading();
                    if (res.code === 0) {
                        openSuccessToast('Revenue claimed!')
                    } else {
                        if (res.code === 104) {
                            openFailedToast('Operation failed! This item already expired or claimed.')
                        } else {
                            openFailedToast('Operation failed. Please try again.')
                            return
                        }
                    }
                    if (index.includes('CardBtn')) {
                        checkAward(address, hash, function (res) {
                            let no = index.split('_')[1];
                            $('#cardState' + no).text(getStatus(res.result.collect_status))
                            if (res.result.collect_status !== 'TO_BE_COLLECTEDT') {
                                $('#' + index).addClass('hide')
                            }
                            getData(function (res) {
                                let data = res.result;
                                initRevenusStatus(data.accumulated_revenue, data.revenue_to_be_collected);
                            }, 1, 'All')
                        })

                    } else {
                        refreshTable(currentPage);
                    }
                });
            } else { // Not the same address with dad wallet, error!!
                // closeLoading();
                openWarnModal('Operation failed! This account is not logged in DAD wallet. Please log in this account, after that please do this operation again.');
            }

        }, (err) => { // fail to login wallet
            // closeLoading();
            openWarnModal('Operation failed! This account is not logged in DAD wallet. Please log in this account, after that please do this operation again.');
        })
    })
}

function getData(cb,pageNext,type) {
    getAwardList(pageNext, 5, convertType(type), sessionStorage.getItem("address"),
        (function (res) {
            cb(res);
            loading = false;
        }),
        ()=>{
            loading = false;
        });
}

function convertType(str){
    if(!str)return 'ALL'
    switch (str) {
        case 'All':
            return 'ALL'
        case 'To be claimed':
            return 'TO_BE_COLLECTEDT'
        case 'Claimed':
            return 'COLLECTED'
        case 'Expired':
            return 'EXPIRED'
        default:
            return 'ALL'
    }

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

function refreshTable(pageNext) {
    if(loading === true)return;
    loading = true;
    getData(function (res) {
        let data = res.result;
        initRevenusStatus(data.accumulated_revenue, data.revenue_to_be_collected);
        totalPage = data.total_page;
        $('#total_page').text(totalPage);
        initTable(data.awards_list);
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
        initRevenusStatus(data.accumulated_revenue, data.revenue_to_be_collected);
        appendCard(data.awards_list);
        currentPage = currentPage+1;
    }, currentPage+1, selectType);
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

//状态选择器
function initSelector(){
    $('#selectAll').on('click', function(){
        handleSelection($(this).text());
    });
    $('#selectTobe').on('click', function(){
        handleSelection($(this).text());
    });
    $('#selectExpired').on('click', function(){
        handleSelection($(this).text());
    });
    $('#selectCollected').on('click', function(){
        handleSelection($(this).text());
    });

    function handleSelection(index){

        if(selectType === index)return;
        selectType = index;
        $('#indicator').text(index);
        initData();
    }

}


// var baseUrl = ' https://explorer.dad.one/test/api/v2';
var baseUrl = 'http://172.20.120.35:8585/v2';

function doRequest(url, cb, cbException = null, type='get')
{
    if(type==='get'){
        // $.get(url).then((res)=>{
        //     if(cb != null)
        //     {
        //         cb(res)
        //     }
        // }).fail((err) => {
        //     console.log('cbException:'+err);
        //     if(cbException)
        //     {
        //         cbException(err);
        //     }
        // }).timeout(15*1000);

        $.ajax({
            url: url,
            type: 'get',
            success: function(data){
                 if(cb)cb(data);
            },
            error: function(data) {
                console.log('ajax fail:'+JSON.stringify(data));
                if(cbException)cbException(data);
            },
            timeout: 5*1000 //in milliseconds
         });
    }
}

function doPost(url, data, cb, cbException = null){
    $.ajax({
        url:url,
        type:'post',
        processData: false,
        contentType: "application/json;charset=UTF-8",
        data: JSON.stringify(data),
        success: function(data){
            if(cb)cb(data);
        },
        error: function(data) {
            console.log('ajax fail:'+JSON.stringify(data));
            if(cbException)cbException(data);
        },
    })
}

/**
 * 获取新的address （60天内）
 * @param {*} start
 * @param {*} end
 * @param {*} cb
 */
function getNewAddr(start, end, cb)
{
    let url = baseUrl + '/summary/address/new/summary?end_time=' + end + '&start_time='+start;
    doRequest(url,cb);
}

/**
 * 获取所有的地址数
 * @param {*} cb
 */
function getAllAddr(cb)
{
    let url = baseUrl + '/summary/blockchain/latest-info';
    doRequest(url , cb);
}

/**
 * 获取每天的交易量（10天内）
 * @param {*} start
 * @param {*} end
 * @param {*} cb
 */
function getDailyTrx(start, end, cb)
{
    let url = baseUrl+'/summary/transactions/daily?end_time=' + end + '&start_time='+start;
    doRequest(url , cb);
}

/**
 * 通过地址获取账户详情
 * @param {*} addr
 * @param {*} cb
 */
function getBalanceByAddr(addr, cb)
{
    let url = baseUrl+ '/addresses/'+ addr + '/balances?asset_name=dad';
    doRequest(url , cb);
}
/**
 * 通过地址获取交易信息，交易信息是分页的
 * @param {*} addr
 * @param {*} pageNumb
 * @param {*} pageSize
 * @param {*} cb
 */
function getTransactionsByAddr(addr, pageNumb, pageSize, cb, cbException) {

    let url = baseUrl +'/addresses/'+ addr + '/transactions/v2?page_number=' + pageNumb + '&page_size='+pageSize;
    console.log('url: '+url)
    doRequest(url , cb, cbException);
}

/**
 * 分页获取所有的块信息
 * @param {*} pageNumb
 * @param {*} pageSize
 * @param {*} cb
 */
function getBlocks(pageNumb, pageSize, cb, cbException)
{
    let url = baseUrl +'/blocks?page_number=' + pageNumb + '&page_size='+pageSize;
    doRequest(url , cb, cbException);
}

function getBlocksV2(pageNumb, pageSize, cb, cbException){
    let url = baseUrl +'/blocks-v2?min_block_number='+pageNumb+'&page_size='+pageSize
    doRequest(url , cb, cbException);
}


/**
 * 分页获取所有的交易信息
 * @param {*} pageNumb
 * @param {*} pageSize
 * @param {*} cb
 */
function getTransactions(pageNumb, pageSize, cb, cbException)
{
    let url = baseUrl +'/transactions-v2?min_index=' + pageNumb + '&page_size='+pageSize;
    doRequest(url , cb, cbException);
}


/**
 * 通过块高度获取块的信息详情
 * @param {*} blockHeight
 * @param {*} cb
 */
function getBlockInfo(blockHeight, cb)
{
    let url = baseUrl +'/blocks/'+blockHeight;
    doRequest(url , cb);
}

/**
 * 通过hash获取交易信息详情
 * @param {*} trxHash
 * @param {*} cb
 */
function getTransactionInfo(trxHash, cb)
{
    let url = baseUrl +"/transactions/"+ trxHash;
    doRequest(url , cb);
}

/**
 * 获取最近的交易信息，默认最近6条交易
 * @param {*} count
 * @param {*} cb
 */
function getLatestTransactions(count, cb)
{
    let url = baseUrl +"/latest-transactions-v2?count="+ count;
    doRequest(url , cb);
}

/**
 * 获取最近的块信息，默认最近6个block
 * @param {*} count
 * @param {*} cb
 */
function getLatestBlocks(count, cb)
{
    let url = baseUrl +"/latest-blocks?count="+ count;
    doRequest(url , cb);
}

/**
 * 获取爆块平均时间
 * @param {*} cb
 */
function getBlockAVGTime(cb)
{
    let url = baseUrl +"/blocks/generate-avg-time";
    doRequest(url , cb);
}

/**
 * 获取区块链最新信息
 * @param {*} cb
 */
function getBlockchainLatestInfo(cb)
{
    let url = baseUrl +"/summary/blockchain/latest-info";
    doRequest(url , cb);
}

/**
 * 获取区块链的tps信息
 * @param {*} cb
 */
function getBlockchainTPS(cb)
{
    let url = baseUrl +"/summary/blockchain/tps";
    doRequest(url , cb);
}

/**
 * 获取testnet src信息
 * @param {*} cb
 */
function getScrInfo(cb){
    let url = baseUrl +"/faucet/dad/srcInfo";
    doRequest(url , cb);
}

function getTestnetToken(address,cb){
    let url = baseUrl +"/faucet/dad/get?to_address="+address;
    doRequest(url , cb);
}

function getWallInfo(page_number, page_size, type, cb){
    let url = baseUrl +"/wall/get?page_number="+page_number+"&page_size="+page_size+"&type="+type;
    doRequest(url , cb);
}

function getAwardList(page_number, page_size, type, address, cb){
    let url = baseUrl +"/user/award/awards-list?address="+address+"&page_number="+page_number+"&page_size="+page_size+"&status="+type;
    doRequest(url , cb);
}

function claimAward(address, tx_hash, cb){
    let url = baseUrl +"/user/award/get";
    const data = {
        address:address,
        task_id:tx_hash
    }
    doPost(url, data, cb);
}

function checkAward(address, tx_hash, cb){
    let url = baseUrl +"/user/award/get/task";
    const data = {
        address:address,
        task_id:tx_hash
    }
    doPost(url, data, cb);
}

function checkAddress(address, cb){
    let url = baseUrl +"/faucet/address/check/"+address;
    doRequest(url , cb);
}





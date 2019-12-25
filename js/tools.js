const walletDownloadAddr = 'chrome.google.com/webstore/detail/dad-wallet/dmjofghfefcmcmaoggmlckpjepdkdkgd?hl=en';


function getLocalTime(ns){
    Date.prototype.toLocaleString = function() {
        return this.getFullYear() + "/" + (this.getMonth() + 1) + "/" + this.getDate() + " " + getSeconds(this.getHours()) + ":" + getSeconds(this.getMinutes()) + ":" + getSeconds(this.getSeconds());
    };

    return new Date(parseInt(ns) * 1000).toLocaleString();
}

function getSeconds(data){
    if(data<10){
        return '0'+data
    }else{
        return data
    }
}

function toFixed1(x) {
    if (Math.abs(x) < 1.0) {
        var e = parseInt(x.toString().split('e-')[1]);
        if (e) {
            x *= Math.pow(10,e-1);
            x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
            if(x.length>=11){
                x = x.substring(0,11)
            }
        }
    } else {
        var e = parseInt(x.toString().split('+')[1]);
        if (e > 20) {
            e -= 20;
            x /= Math.pow(10,e);
            x += (new Array(e+1)).join('0');
        }
    }
    return x;
}

function trim(str){
    if(!str) return '---'
    if(str.length>8){
        return str.substring(0,4)+'...'+str.substring(str.length-4,str.length);
    }
}

function trim6(str){
    if(!str) return '---'
    if(str.length>8){
        return str.substring(0,6)+'...'+str.substring(str.length-6,str.length);
    }
}

function calcTimeDiffer(inputTimeStamp){
  const current_timestamp = (new Date()).getTime()/1000;
  var timeDiffer = current_timestamp - inputTimeStamp;
  return date_format(timeDiffer)
}

function date_format(micro_second) {
    var res ='';


    var d = parseInt(micro_second/86400);
    var h = parseInt(micro_second/1/60/60%24);
    var m = parseInt(micro_second/1/60%60);
    var s = parseInt(micro_second/1%60);
    if(d>0){
        if(d == 1){
            res += d+' day ';
        }else  {
            res += d+' days ';
        }
        return  res
    }

    if(h>0){
        if(h == 1){
            res += h+' hour '
        }else {
            res += h+' hours '
        }
        return  res
    }

    if(m>0){
        if(m == 1){
            res += m+' min '
        }else {
            res += m+' mins '
        }
        return  res
    }

    if(s>1){
        res += s +' secs'
        return  res
    }else{
        res += 1 +' sec'
        return  res
    }


}

$(window).scroll(function(){
  changeNav();
});

function toThousands(num) {
    var result = [ ], counter = 0;
    num = (num || 0).toString().split('');
    for (var i = num.length - 1; i >= 0; i--) {
        counter++;
        result.unshift(num[i]);
        if (!(counter % 3) && i != 0) { result.unshift(','); }
    }
    return result.join('');
}

function notFound(){
    window.location.href = 'noresults.html'
}

function changeNav(){
  var navbar = $('#page-layout-nav');
  if($(this).scrollTop() > 50) {
    navbar.addClass('navbar-solid');
    navbar.removeClass('navbar-transparet');
  } else {
    navbar.addClass('navbar-transparet');
    navbar.removeClass('navbar-solid');
  }
}

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  return date + ' ' + month;
}

function openSuccessToast(inputString){
    if(!inputString)return;

    $('#success_toast_text').text(inputString);
    $('#success_toast').show();
    setTimeout(() => {
        $('#success_toast').fadeOut('slow');
    }, 1000);
}

function openFailedToast(inputString){
    if(!inputString)return;
    $('#failed_toast_text').text(inputString);
    $('#failed_toast').show();
    setTimeout(() => {
        $('#failed_toast').fadeOut('slow');
    }, 2000);
}

//打开下载钱包modal
function openDownloadModal(){
    $('#downloadModal').modal('show');
    $('#downloadBtn').off('click');
    $('#cancelBtn').off('click');
    $('#cancelBtn').on('click', function(){
        $('#downloadModal').modal('hide');
    })

    $('#downloadBtn').on('click', function(){
        window.open('http://'+walletDownloadAddr, '_blank');
    })
}

//打开提示页面modal
function openWarnModal(warnText){
    if(!warnText)return;
    $('#modalWarnText').text(warnText);
    $('#warnModal').modal('show');
}

function openLoading(){
    $('#loadingModal').modal('show');
}

function closeLoading(){
    $('#loadingModal').modal('hide');
}

function renderAddress(address){
    if(!address)return;
    $('#addressInfo').text(trim6(address))
}


function checkLogin(){
    let data = sessionStorage.getItem('address')
    if(data && data.length>0){
        $('#loginButton').addClass('hidden');
        renderAddress(data)
        $('#account').removeClass('hidden')
    }else{
        if(window.location.pathname.includes('center')){
            window.location.replace('../index_en.html')
        }
    }
}

function dapiLogin(cbOk, cbFail){
    (async () => {
        // 1. get wallet info
        try {
            let res = await isWalletAvaliable();
            if (res) {
                console.log('get wallet ok' + res);
            } else {
                // alert('get wallet fail:' + res);
                cbFail({code:1});//钱包未安装
                return;
            }
        } catch (error) {
            // alert('get wallet error:' + error);
            cbFail({code:1});//钱包未安装
            return
        }

        // 2. get account info
        let addr = null;
        try {
            let res = await getAccount();
            if (res.code == 0) {
                console.log('login success:' + JSON.stringify(res));
                cbOk(res.result.value);
            } else {
                // alert('login fail:' + JSON.stringify(res));
                cbFail({code:2});//账户未登录
                return;
            }
        } catch (error) {
            // alert('login error:' + error);
            cbFail({code:2});//账户未登录
            return;
        }
    })();
}

//绑定登录按钮
$(document).on( 'click', '#loginButton', function(){
    dapiLogin((addr)=>{
        openSuccessToast('login success');
        const address = addr;
        sessionStorage.setItem('address',address);
        $('#loginButton').addClass('hidden');
        renderAddress(address)
        $('#account').removeClass('hidden')
    }, (err)=>{
        console.log('loing err:'+ JSON.stringify(err));
        if(err.code ===1){
            openDownloadModal();
        }else if(err.code ===2){
            openWarnModal('Not logged into Wallet');
        }else{
            openWarnModal('Unkown error:'+err);
        }
    })
});

checkLogin();

setTimeout(()=>{checkLogin()}, 0.3*1000)

//绑定登出按钮
$(document).on( 'click', '#logoutBtn', function(){
    $('#account').addClass('hidden');
    $('#loginButton').removeClass('hidden');
    sessionStorage.removeItem('address');
    if(window.location.pathname.includes('center')){
        window.location.replace('../index_en.html')
    }
});


$(document).on('click', '.fb-item',function(){
    window.open('https://www.facebook.com/DAD.Official2018')
});
$(document).on('click', '.tele-item', function(){
    window.open('https://t.me/dad_official')
});
$(document).on('click', '.tw-item' ,function(){
    window.open('https://twitter.com/Dad_Chain')
});
$(document).on('click',  '.me-item',function(){
    window.open('https://medium.com/@dad_chain')
});



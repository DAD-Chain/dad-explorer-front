const successText = 'Operation successful!';
const invalidAddress = 'Operation Failed! Please input a valid address.'
const alreadyGotText = 'Operation failed! The address has already claimed test tokens.';
const notEnoughBalance = ' Insufficient balance';
var balance;

getScrInfo(res=>{
    $('#serverAccount').text(res.result.address);
    $('#serverBalance').text((res.result.balance/1000000000).toFixed(2));
    balance = (res.result.balance/1000000000).toFixed(2)
});

function submit(){
    let inputAddress = $('#input_search').val();
    if(inputAddress.length === 0)return;
    if(balance<1000){
        openFailedToast(notEnoughBalance);
        return
    }
    checkAddress(inputAddress, function(res){
        if(res.code===0){
            if(res.result !== true){
                openFailedToast(invalidAddress);
                return;
            }
            getTestnetToken(inputAddress, function(res){
                if(res.code === 0){
                    openSuccessToast(successText)
                }else{
                    openFailedToast(alreadyGotText)
                }
            })
        }else{
            openFailedToast('Operation Failed! Please try again later.');
        }
        console.log(res)
    })
}


$('#sizing-addon').on('click',()=>{
    submit();
});

$('#input_search').keyup(()=>{
    if(event.key === 'Enter'){
        submit();
    }
});


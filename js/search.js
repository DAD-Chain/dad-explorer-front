/**
 * Created by C0la on 2019/8/25.
 */

$('#input_search').keyup(()=>{
  if(event.key === 'Enter'){
    submitSearch()
  }
});

$('#sizing-addon').on('click', function(){
  submitSearch()
})

function submitSearch() {
  const searchContent = $('#input_search').val();
  if (searchContent !== '') {
    switch (searchContent.length) {
      /* txhash */
      case 64:
        searchHash(searchContent);
        break;
      /* address */
      case 34:
        searchAddress(searchContent)
        break;
      /* contract hash */
      case 1:
        searchHeight(searchContent)
        break;
      case 2:
        searchHeight(searchContent)
        break;
      case 3:
        searchHeight(searchContent)
        break;
      case 4:
        searchHeight(searchContent)
        break;
      case 5:
        searchHeight(searchContent)
        break;
      case 6:
        searchHeight(searchContent)
        break;
      case 7:
        searchHeight(searchContent)
        break;
      case 8:
        searchHeight(searchContent)
        break;
      case 9:
        searchHeight(searchContent)
        break;
      case 10:
        searchHeight(searchContent)
        break;
      default:
        notResults();
    }
  }
}

function searchHash(res){
  window.location.href = 'pages/trx_en.html?'+res;
}

function searchAddress(res){
  window.location.href = 'pages/address_en.html?'+res;
}

function searchHeight(input){
  if(/^[0-9]+$/.test(input)){
    window.location.href ='pages/block_en.html?'+input
  }else{
    notResults()
  }
}

function notResults(){
  window.location.href = 'pages/noresults.html'
}

var chartTRX = null;
var chartAddr = null;

var newAddrOut = 26;
var otherAddrOut = 74;


//圆形chart预配置
var labelTop = {
    normal : {
        label : {
            show : true,
            position : 'center',
            formatter : '{b}',
            textStyle: {
                baseline : 'bottom'
            }
        },
        labelLine : {
            show : false
        }
    }
};
var labelFromatter = {
    normal : {
        label : {
            formatter : function (params){
                let per = 0;
                if(newAddrOut+otherAddrOut != 0) {
                    per = ((newAddrOut)/(newAddrOut+otherAddrOut)*100);
                }
                per = Math.floor(per*1000)/1000; //不四舍五入, 保留小数点后三位，其余忽略。 注：toFixed(3)会进行四舍五入
                return per + '%'
            },
            textStyle: {
                baseline : 'top',
                color: "#1BE9B9"
            }
        }
    },
}
var labelBottom = {
    normal : {
        color: '#0000ff',
        label : {
            show : true,
            position : 'center'
        },
        labelLine : {
            show : false
        }
    },
    emphasis: {
        color: 'rgba(0,0,0,0)'
    }
};

require.config({
    paths: {
        echarts: 'https://echarts.baidu.com/build/dist'
    }
});

// chart-daliy-trx
require(
    [
        'echarts',
        'echarts/chart/line' // 使用柱状图就加载bar模块，按需加载
    ],
    function (ec) {
        // 基于准备好的dom，初始化echarts图表
        chartTRX = ec.init(document.getElementById('chart-daily-trx'));

        var option = {
            grid: {
                show: false ,
                borderWidth: 0,
                x: 80,
                x2: 50,
            },
            backgroundColor: '#2D3848',
            title : {
                text: '',
                subtext: ''
            },
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                show: false,
                data:['trx']
            },
            toolbox: {
                show : false,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: true},
                    magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : false,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    splitLine:{show: false},
                    data : ['Aug 5','Aug 6','Aug 7','Aug 8','Aug 9','Aug 10','Aug 11','Aug 12'],
                    axisLabel: {
                        textStyle: {
                            color: '#596A80',
                        }
                    },
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    splitLine:{show: false},
                    axisLabel: {
                        textStyle: {
                            color: '#596A80',
                        }
                    },
                }
            ],
            series : [
                {
                    name:'trx',
                    type:'line',
                    smooth:true,
                    itemStyle: {
                        normal: {
                            color: '#FFFFFF',
                            areaStyle: {
                                type: 'default',
                                color: '#008571',
                            },
                            lineStyle:{
                                color: '#00EBB6',
                                width: 4,
                            }
                        },
                    },
                    data:[100, 120, 91, 54, 60, 30, 71, 83]
                }
            ]
        };

        // 为echarts对象加载数据
        chartTRX.setOption(option);
        refreshTrx();
    }
);

// chart-new-addr 使用
require(
    [
        'echarts',
        'echarts/chart/pie' // 使用柱状图就加载bar模块，按需加载
    ],
    function (ec) {
        // 基于准备好的dom，初始化echarts图表
        chartAddr = ec.init(document.getElementById('chart-new-addr'));
        var radius = [90, 55];
        option = {
            legend: {
                x : 'center',
                y : 'center',
                show: false ,
              show:false,
                data:[
                    'New ADDR'
                ]
            },
            title : {
                text: 'The App World',
                subtext: 'from global web index',
                x: 'center',
                show: false ,
            },
            toolbox: {
                show : false,
                feature : {
                    dataView : {show: true, readOnly: true},
                    magicType : {
                        show: true,
                        type: ['pie', 'funnel'],
                        option: {
                            funnel: {
                                width: '20%',
                                height: '30%',
                                itemStyle : {
                                    normal : {
                                        label : {
                                            formatter : function (params){
                                                return 'other\n' + params.value + '%\n'
                                            },
                                            textStyle: {
                                                baseline : 'middle'
                                            }
                                        }
                                    },
                                }
                            }
                        }
                    },
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            series : [

                {
                    type : 'pie',
                    center : ['50%', '50%'],
                    radius : radius,
                    y: '55%',   // for funnel
                    x:'80%', // for funnel
                    itemStyle : labelFromatter,
                    data : [
                        {name:'other', value:74, itemStyle : labelBottom},
                        {name:'New Address', value:26,itemStyle : labelTop}
                    ]
                }
            ]
        };
        // 为echarts对象加载数据
        chartAddr.setOption(option);
        refreshAddr();
    }
);

function refreshTrx()
{
    console.log("refreshTrx");
    let end = Math.ceil(new Date().getTime()/1000);
    let start = end-9*24*60*60;
    console.log('trx end:'+end);
    console.log('trx start:'+start);
    if(!chartTRX){
        console.log("chart of trx is null, return");
        return;
    }

    getDailyTrx(start , end, (res)=>{
        if(res.code != 0){
            console.warn(""+ JSON.stringify(res));
            return;
        }
        var option = chartTRX.getOption();

        var xData = [];
        var yData = [];
        res.result.forEach(element => {
            xData.push(element.time_day);
            yData.push(element.tx_count);
        });

        var xData2 = xData.map(function(element){
            return timeConverter(element);
        });

        console.log("xdata: "+ xData);
        console.log("xdata2: "+ xData2);
        console.log("ydata: "+ yData);
        option.series[0].data = yData;
        option.xAxis[0].data = xData2;
        chartTRX.setOption(option);

        if(yData.length >0)
        {
            $('#trx-today').text(yData[yData.length -1]);
        }
    });
}

function refreshAddr()
{
    console.log("refreshAddr");
    let end = Math.ceil(new Date().getTime()/1000);
    let start = end-7*24*60*60;
    console.log('addr end:'+end);
    console.log('addr start:'+start);

    if(!chartAddr){
        console.log("chart of addr is null, return");
        return;
    }

    getAllAddr((res1)=>{
        if(res1.code != 0)
        {
            console.warn(""+ JSON.stringify(res1));
            return;
        }

        let totalAddr = res1.result.address_count;
        $('#addr-total').text(totalAddr);
        getNewAddr(start, end, (res2)=>{
            if(res2.code != 0)
            {
                console.warn(""+ JSON.stringify(res2));
                return;
            }
            let newAddr = res2.result.new_count;
            newAddrOut = newAddr;
            otherAddrOut = totalAddr-newAddr;
            $('#addr-new').text(newAddr);
            let others = {name:'other', value:totalAddr-newAddr, itemStyle : labelBottom};
            let newAddrs = {name:'New Address', value:newAddr,itemStyle : labelTop};
            let data = [];
            data.push(others);
            data.push(newAddrs);
            var option = chartAddr.getOption();
            option.series[0].data = data;
            chartAddr.setOption(option);
        });
    });
}

setInterval(function(){
    refreshTrx();
    refreshAddr();
}, 15000)


window.onresize = function(){
    if(chartAddr){
        chartAddr.resize();
    }

    if(chartTRX){
        chartTRX.resize();
    }
}
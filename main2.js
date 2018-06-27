// import $ from 'https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.3.1.min.js';

// import {$,jQuery} from 'jquery';
// // export for others scripts to use
// window.$ = $;
// window.jQuery = jQuery;

var max_base_3j = parseFloat($("#max_base_3j").val());
var min_base_3j = parseFloat($("#min_base_3j").val());
var max_base_gjj = parseFloat($("#max_base_gjj").val());
var min_base_gjj = parseFloat($("#min_base_gjj").val());
var city = $('#city').val();

// function fixad() {
//     $('#myAffix').affix({
//       offset: {
//         top: 0
//       },
//       target: $('.main')
//     });
// }

function mobileSize() {
    var $faqList = $(".sidebar .faq-list").clone();
    $faqList.addClass("list-group").css("margin-top", "10px").find("li").addClass("list-group-item").removeClass("active");
    $("#footer").before($faqList);
    $(".faq-calc-btn").removeClass("btn-lg");
}

$(function(){
    if ($(window).width() > 991) {
        // fixad();
    }

    if ($(window).width() < 768) {
        mobileSize();
        resizeMobileSize();
    }

    $(window).resize(function(){
        if ($(window).width() > 991) {
            // fixad();
        }

        if ($(window).width() < 768) {
            resizeMobileSize();
        }
    });

    // $('#myAffix').on('affix.bs.affix', function(){
    //     $(this).width($(this).parent().width());
    // });

    $('#faq-panel-title').click(function(){
        $('.sidebar .ad').slideToggle(400);
    });

    // $('#left-nav-link, #lef-nav-button').modal();

    $('#input_origin_salary').focus();
    $('#execute').click(function(){
        $('#execute').val('计算中');
        calculate();
    });

    var os = $('#input_origin_salary').val();
    if(!$('#input_is_base_3j_customize').prop('checked'))
    {
        $('#input_base_3j').val(os>max_base_3j?max_base_3j:os<min_base_3j?min_base_3j:os);
    }
    if(!$('#input_is_base_gjj_customize').prop('checked'))
    {
        $('#input_base_gjj').val(os>max_base_gjj?max_base_gjj:os<min_base_gjj?min_base_gjj:os);
    }

    $('#input_is_exgjj').click(function(){
        if($(this).prop('checked'))
        {
            $('#input_factor_exgjj').removeAttr('disabled');
        }
        else
        {
            $('#input_factor_exgjj').attr('disabled', 'disabled');
        }
    });

    $('#input_is_base_3j_customize').click(function(){
        if($(this).prop('checked'))
        {
            $('#input_base_3j').removeAttr('disabled');
        }
        else
        {
            $('#input_base_3j').attr('disabled', 'disabled');
            $('#input_base_3j').val(os>max_base_3j?max_base_3j:os<min_base_3j?min_base_3j:os);
        }
    });

    $('#input_is_base_gjj_customize').click(function(){
        if($(this).prop('checked'))
        {
            $('#input_base_gjj').removeAttr('disabled');
        }
        else
        {
            $('#input_base_gjj').attr('disabled', 'disabled');
            $('#input_base_gjj').val(os>max_base_gjj?max_base_gjj:os<min_base_gjj?min_base_gjj:os);
        }
    });

    $('#input_origin_salary').keyup(function(){
        var os = $(this).val();
        if(!$('#input_is_base_3j_customize').prop('checked')){
            $('#input_base_3j').val(os > max_base_3j ? max_base_3j : (os < min_base_3j ? min_base_3j : os));
        }
        if(!$('#input_is_base_gjj_customize').prop('checked')){
            $('#input_base_gjj').val(os>max_base_gjj?max_base_gjj:os<min_base_gjj?min_base_gjj:os);
        }
    });


    $(window).keydown(function(event){
        switch(event.keyCode) {
            case 13:$('#execute').click();break;
            default:break;
        }
    });

    $('#city_list label, #city_list ul').each(function(){
        $(this).hover(
            function(){
                var id = $(this).attr('id');
                $('#map a.'+id).addClass('highlight');
            },
            function(){
                var id = $(this).attr('id');
                $('#map a.'+id).removeClass('highlight');
            }
        );
    });
});

function calculate() {
    $.get(
        "/calculate",
        {
            city:city,
            origin_salary:$('#input_origin_salary').val(),
            base_3j:$('#input_base_3j').val(),
            base_gjj:$('#input_base_gjj').val(),
            is_gjj:$('#input_is_gjj').prop('checked'),
            is_exgjj:$('#input_is_exgjj').prop('checked'),
            factor_exgjj:$('#input_factor_exgjj > option:selected').val()
        },
        function(data){
            $('#execute').val('计算');
            $('#review_result').remove();
            $('#detail').show();
            $('#detail .badge').tooltip();
            $('#final_salary').val(data.final_salary);
            $('#result').show();
            $('#go-to-report').show();
            $('input.input_text').each(function(){var temp = roundNumber($(this).val(), 2); $(this).val(temp);});

            // 非法输入替换
            $('#input_origin_salary').val(data.origin_salary);
            $('#input_base_3j').val(data.base_3j);
            $('#input_base_gjj').val(data.base_gjj);
            // 明细
            $('#show_personal_yanglao').html(data.personal_yanglao);
            $('#show_org_yanglao').html(data.org_yanglao);
            $('#show_personal_yiliao').html(data.personal_yiliao);
            $('#show_org_yiliao').html(data.org_yiliao);
            $('#show_personal_shiye').html(data.personal_shiye);
            $('#show_org_shiye').html(data.org_shiye);
            $('#show_personal_gjj').html(data.personal_gjj);
            $('#show_org_gjj').html(data.org_gjj);
            $('#show_personal_exgjj').html(data.personal_exgjj);
            $('#show_org_exgjj').html(data.org_exgjj);
            $('#show_org_gongshang').html(data.org_gongshang);
            $('#show_org_shengyu').html(data.org_shengyu);

            $('#show_personal_allpay').html(data.personal_allpay);
            $('#show_org_allpay').html(data.org_allpay);

            $('#show_before_tax').html(data.before_tax);
            $('#show_tax').html(data.tax);

            $('#show_result').html(data.final_salary);

            $('.show_percent_factor_exgjj').html(' ('+data.percent_factor_exgjj+')');

            renderPersonalPieChart(data, "#chart1");
            renderOrgPieChart(data, "#chart2");
        },
        'json'
    );
}

function renderPersonalPieChart(data, selector) {
    var $target = $(selector);
    $target.highcharts({
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: true
        },
        title: {
            text: '税前工资去向'+' (共￥'+data.origin_salary+')'
        },
        tooltip: {
            pointFormat: '￥{point.y}<br />{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                },
                size: (($(window).width()>=480) ? 180 : 100)
            }
        },
        series: [{
            type: 'pie',
            name: '比例',
            data: [
                ['税后月薪', parseFloat(data.final_salary)],
                ['养老保险金', parseFloat(data.personal_yanglao)],
                ['医疗保险金', parseFloat(data.personal_yiliao)],
                ['失业保险金', parseFloat(data.personal_shiye)],
                ['基本住房公积金', parseFloat(data.personal_gjj)],
                ['补充住房公积金', parseFloat(data.personal_exgjj)],
                ['个人所得税', parseFloat(data.tax)]
            ]
        }]
    });
}

function renderOrgPieChart(data, selector) {
    var $target = $(selector);
    $target.highcharts({
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: true
        },
        title: {
            text: '单位成本去向'+' (共￥'+(parseFloat(data.origin_salary)+parseFloat(data.org_allpay))+')'
        },
        tooltip: {
            pointFormat: '￥{point.y}<br />{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                },
                size: (($(window).width()>=480) ? 180 : 100)
            }
        },
        series: [{
            type: 'pie',
            name: '比例',
            data: [
                ['个人税后月薪', parseFloat(data.final_salary)],
                ['个人养老保险金', parseFloat(data.personal_yanglao)],
                ['个人医疗保险金', parseFloat(data.personal_yiliao)],
                ['个人失业保险金', parseFloat(data.personal_shiye)],
                ['个人基本住房公积金', parseFloat(data.personal_gjj)],
                ['个人补充住房公积金', parseFloat(data.personal_exgjj)],
                ['个人所得税', parseFloat(data.tax)],
                ['企业养老保险金', parseFloat(data.org_yanglao)],
                ['企业医疗保险金', parseFloat(data.org_yiliao)],
                ['企业失业保险金', parseFloat(data.org_shiye)],
                ['企业工伤保险金', parseFloat(data.org_gongshang)],
                ['企业生育保险金', parseFloat(data.org_shengyu)],
                ['企业基本住房公积金', parseFloat(data.org_gjj)],
                ['企业补充住房公积金', parseFloat(data.org_exgjj)]

            ]
        }]
    });
}

function roundNumber(number,decimals) {
    var newString;// The new rounded number
    decimals = Number(decimals);
    if (decimals < 1) {
        newString = (Math.round(number)).toString();
    } else {
        var numString = number.toString();
        if (numString.lastIndexOf(".") == -1) {// If there is no decimal point
            numString += ".";// give it one at the end
        }
        var cutoff = numString.lastIndexOf(".") + decimals;// The point at which to truncate the number
        var d1 = Number(numString.substring(cutoff,cutoff+1));// The value of the last decimal place that we'll end up with
        var d2 = Number(numString.substring(cutoff+1,cutoff+2));// The next decimal, after the last one we want
        if (d2 >= 5) {// Do we need to round up at all? If not, the string will just be truncated
            if (d1 == 9 && cutoff > 0) {// If the last digit is 9, find a new cutoff point
                while (cutoff > 0 && (d1 == 9 || isNaN(d1))) {
                    if (d1 != ".") {
                        cutoff -= 1;
                        d1 = Number(numString.substring(cutoff,cutoff+1));
                    } else {
                        cutoff -= 1;
                    }
                }
            }
            d1 += 1;
        }
        if (d1 == 10) {
            numString = numString.substring(0, numString.lastIndexOf("."));
            var roundedNum = Number(numString) + 1;
            newString = roundedNum.toString() + '.';
        } else {
            newString = numString.substring(0,cutoff) + d1.toString();
        }
    }
    if (newString.lastIndexOf(".") == -1) {// Do this again, to the new string
        newString += ".";
    }
    var decs = (newString.substring(newString.lastIndexOf(".")+1)).length;
    for(var i=0;i<decimals-decs;i++) newString += "0";
    //var newNumber = Number(newString);// make it a number if you like
    return newString; // Output the result to the form field (change for your purposes)
}
/**
 * Created by Administrator on 2017/4/25 0025.
 */
function ajaxPost(url,dat,fun){
    var index = layer.load(2);
    $.ajax({
        url: url,
        type:'post',
        dataType:'json',
        data: dat,
        success: function(data){ //成功的回调函数的处理
            layer.close(index);
            fun(data);
        },
        error:function(errorData){
            console.log(JSON.stringify(errorData));
            if(errorData.readyState=='0'){
                layer.close(index);
                layer.alert('请先链接服务器');
            }
        }
    });
}
function ajaxGet(url,fun){
    var index = layer.load(2);
    $.ajax({
        url: url,
        type:'get',
        dataType:'json',
        success: function(data){ //成功的回调函数的处理
            layer.close(index);
            fun(data);
        },
        error:function(errorData){
            console.log(JSON.stringify(errorData));
            if(errorData.readyState=='0'){
                layer.close(index);
                layer.alert('请先链接服务器');
            }
        }
    });
}
function ajaxGetAsync(url,fun){
    var index = layer.load(2);
    $.ajax({
        url: url,
        type:'get',
        dataType:'json',
        async: false,
        success: function(data){ //成功的回调函数的处理
            layer.close(index);
            fun(data);
        },
        error:function(errorData){
            console.log(JSON.stringify(errorData));
            if(errorData.readyState=='0'){
                layer.close(index);
                layer.alert('请先链接服务器');
            }
        }
    });
}
function ajaxPostAsync(url,dat,fun){
    var index = layer.load(2);
    $.ajax({
        url: url,
        type:'post',
        dataType:'json',
        data: dat,
        async: false,
        success: function(data){ //成功的回调函数的处理
            layer.close(index);
            fun(data);
        },
        error:function(errorData){
            if(errorData.readyState=='0'){
                layer.close(index);
                layer.alert('请先链接服务器');
            }
        }
    });
}
function ajaxPostArray(url,dat,fun){
    var index = layer.load(2);
    $.ajax({
        url: url,
        type:'post',
        dataType:'json',
        data: dat,
        traditional: true,
        success: function(data){ //成功的回调函数的处理
            layer.close(index);
            fun(data);
        },
        error:function(errorData){
            if(errorData.readyState=='0'){
                layer.close(index);
                layer.alert('请先链接服务器');
            }
        }
    });
}
function ajaxGetArray(url,dat,fun){
    var index = layer.load(2);
    $.ajax({
        url: url,
        type:'get',
        dataType:'json',
        data: dat,
        traditional: true,
        success: function(data){ //成功的回调函数的处理
            layer.close(index);
            fun(data);
        },
        error:function(errorData){
            if(errorData.readyState=='0'){
                layer.close(index);
                layer.alert('请先链接服务器');
            }
        }
    });
}
function ajaxPostObj(url,dat,fun){
    var index = layer.load(2);
    $.ajax({
        url: url,
        type:'post',
        dataType:'json',
        contentType: "application/json",
        data: dat,
        success: function(data){ //成功的回调函数的处理
            layer.close(index);
            fun(data);
        },
        error:function(errorData){
            console.log(JSON.stringify(errorData));
            if(errorData.readyState=='0'){
                layer.close(index);
                layer.alert('请先链接服务器');
            }
        }
    });
}

function hasClass(ele, cls) {
    cls = cls || '';
    if (cls.replace(/\s/g, '').length == 0) return false; //当cls没有参数时，返回false
    return new RegExp(' ' + cls + ' ').test(' ' + ele.className + ' ');
}

function addClass(ele, cls) {
    if (!hasClass(ele, cls)) {
        ele.className = ele.className == '' ? cls : ele.className + ' ' + cls;
    }
}

function removeClass(ele, cls) {
    if (hasClass(ele, cls)) {
        var newClass = ' ' + ele.className.replace(/[\t\r\n]/g, '') + ' ';
        while (newClass.indexOf(' ' + cls + ' ') >= 0) {
            newClass = newClass.replace(' ' + cls + ' ', ' ');
        }
        ele.className = newClass.replace(/^\s+|\s+$/g, '');
    }
}

//对象中时间排序 ——升序
function compare_asc(property){ //升序
    return function(a,b){
        var value1 = a[property];
        var value2 = b[property];
        return value1 > value2 ? 1 : -1;
    }
}
function compare_des(property){ //升序
    return function(a,b){
        var value1 = a[property];
        var value2 = b[property];
        return value2 > value1 ? 1 : -1;
    }
}

//对象的深拷贝
var deepCopy= function(source) {

    var result={};

    for (var key in source) {

        result[key] = typeof source[key]==='object'? deepCopy(source[key]): source[key];

    }
    return result;
}

//时间控件
function DatePicker(beginSelector,endSelector){
    // 仅选择日期
    $(beginSelector).datepicker(
        {
            language: 'zh-CN',
            todayBtn: "linked",
            keyboardNavigation: false,
            forceParse: false,
            autoclose: true,
//                format: "yyyy-mm-dd",
        }).on('changeDate', function(ev){
        if(ev.date){
            $(endSelector).datepicker('setStartDate', new Date(ev.date.valueOf()))
        }else{
            $(endSelector).datepicker('setStartDate',null);
        }
    })

    $(endSelector).datepicker(
        {
            language: 'zh-CN',
            todayBtn: "linked",
            keyboardNavigation: false,
            forceParse: false,
            autoclose: true
        }).on('changeDate', function(ev){
        if(ev.date){
            $(beginSelector).datepicker('setEndDate', new Date(ev.date.valueOf()))
        }else{
            $(beginSelector).datepicker('setEndDate',new Date());
        }

    })
}
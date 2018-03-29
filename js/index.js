$(function(){
    //菜单点击
    //J_iframe
    $(".J_menuItem").on('click',function(){
        var url = $(this).attr('href');
        $("#J_iframe").attr('src',url);
        return false;
    });
    // 菜单切换
    $('.nav-close').click(function () {
        $("body").toggleClass("mini-navbar");
        SmoothlyMenu();
    });
    function SmoothlyMenu() {
        if (!$('body').hasClass('mini-navbar')) {
            $('.metismenu').hide();
            setTimeout(
                function () {
                    $('.metismenu').fadeIn(500);
                }, 100);
        } else if ($('body').hasClass('fixed-sidebar')) {
            $('.metismenu').hide();
            setTimeout(
                function () {
                    $('.metismenu').fadeIn(500);
                }, 300);
        } else {
            $('.metismenu').removeAttr('style');
        }
    }
    $('.metismenu>li').click(function () {
        if ($('body').hasClass('mini-navbar')) {
            $("body").toggleClass("mini-navbar");
            SmoothlyMenu();
        }
    });
});
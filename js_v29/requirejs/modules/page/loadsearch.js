define(['plugins/ifscroll', 'plugins/masonry', 'plugins/imagesloaded', 'modules/thongbao', 'modules/jdenticon', 'modules/win', 'main'], function(InfiniteScroll, Masonry, imagesLoaded, thongbao, Jdenticon, win, Main) {
    var l = new Masonry(".grid", {
        itemSelector: ".grid__item",
        columnWidth: ".grid__col-sizer",
        gutter: ".grid__gutter-sizer",
        percentPosition: true,
        stagger: 30,
        visibleStyle: {
            transform: "translateY(0)",
            opacity: 1
        },
        hiddenStyle: {
            transform: "translateY(100px)",
            opacity: 0
        }
    });
    win.msnry = l;
    var tip = 0,
        socialShareLoaded = false,
        downloadbtn = 'yes';

    function downloadfile() {
        $(".grid").off("click");
        $(".grid").on("click", ".downloadfile", function(e) {
            e.preventDefault();
            var btn = $(this),
                id = btn.attr('data-id');
            type = btn.data("type");
            var currentVote = btn.data('count');
            if (siteConst.voteTypes.includes(type)) {
                thongbao.macdinh('success', 'Successful', 'Thank you for voting!');
                btn.attr("data-count", ++currentVote).addClass("active");
                return hjax({}, "/f/downloadlink/" + id, 'post');
            }
            processBtn(btn);
            var p = hjax({}, "/f/downloadlink/" + id, 'post');
            p.done(function(data) {
                if (data.success == false) {
                    if (data.data == 'notfound') thongbao.macdinh('error', 'File Not Found');
                    else if (data.data == 'login') thongbao.macdinh('error', 'You need login to download this file');
                    else if (data.data == 'vip') thongbao.macdinh('error', 'This file only available with VIP account');
                    else thongbao.macdinh('error', 'Have something error');
                    btn.html('Download Not Successful');
                } else {
                    var id = data.data
                    if (id == 'external') {
                        btn.removeAttr('disabled').removeClass('downloadfile').html('Click to Download').attr("href", data.href);
                        thongbao.macdinh('success', 'Successful', 'Click to download');
                    } else {
                        var d = hjax({
                            id: id
                        }, siteConst.download_url + '/download.php', 'get');
                        d.done(function(data) {
                            if (data.success == true) {
                                btn.removeAttr('disabled').removeClass('downloadfile').html('Click to Download').attr("href", data.url);
                                thongbao.macdinh('success', 'Successful', 'Click to download');
                            } else {
                                thongbao.macdinh('error', 'Have something error');
                                btn.html('Download Not Successful');
                            }
                            btn.attr("data-count", ++currentVote).addClass("active");
                        })
                    }
                }
                btn.unbind('click');
            })
        })
    }
    var s = new InfiniteScroll(".grid", {
        path: function() {
            var next = $("#loadmore").attr("data-next");
            var start = $("#loadmore").attr("data-start");
            if (pageType == 'search') {
                var sortby = $("input[name='typefilter']:checked").attr("data-sortby"),
                    sort = $("input[name='typefilter']:checked").attr("data-sort");
                if (next == 'false') {
                    searchtips();
                    reloadMasonry();
                    return false;
                }
                return "/slazy?customad=no&sortby=" + searchConst.sortBy + "&sort=desc&k=" + searchConst.keyword + "&page=" + next + "&downloadbtn=yes";
            }
            if (pageType == 'homepage') {
                return $("#loadmore").attr("data-url") + next + '/' + start;
            }
            if (pageType == 'profile') {
                return $("#loadmore").attr("data-url") + '?page=' + next;
            }
            if (pageType == 'saved') {
                return $("#loadmore").attr("data-url") + '?start=' + start;
            }
        },
        responseType: "text",
        outlayer: l,
        status: ".page-load-status",
        history: !1
    });
    s.on("load", function(res) {
        var data = JSON.parse(res);
        if (data.success) {
            var newItems = data.html;
            var next = data.next;
            var count = data.count;
            var start = data.start;
            $("#loadmore").attr({
                "data-next": next,
                "data-start": start
            });
            t = document.createElement("div");
            t.innerHTML = newItems;
            var i = t.querySelectorAll(".grid__item");
            imagesLoaded(i, function() {
                s.appendItems(i), l.appended(i);
                Main.SocialShare();
                if (siteConst.isVIP != 1) {
                    Main.displayGoogleAds();
                }
                downloadfile();
                Jdenticon.Load();
                if (count < 20 && pageType == 'search') {
                    searchtips();
                }
            });
        }
    }), s.loadNextPage();

    function searchtips() {
        if (tip > 0) return false;
        tip++;
        var $items = $('<div class="grid__item card bg-light"><div class="card-body"><h4 class="card-title text-danger" itemprop="caption description">Too few results?</h4><p>We have more interesting things than what you see. Please spend few seconds to read these searching tips</p></div><div class="card-footer text-muted d-flex align-items-center justify-content-between"><div class="float-right"><a href="https://nohat.cc/page/36cbad70bfd84cdaa532" target="_blank" class="btn btn-outline-primary">Click to read </a></div></div></div>');
        $(".grid").append($items);
        Main.reloadma();
    }
});
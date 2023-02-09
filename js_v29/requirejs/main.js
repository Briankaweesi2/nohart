define(['require', 'sweetalert', 'plugins/copyToClipboard', 'plugins/xss'], function(require, Swal, copyToClipboard) {
    $(document).on('focus blur', '.form-group-g-style input', function(e) {
        $(this).parents('.form-group-g-style').toggleClass('active', (e.type === 'focusin' || this.value.length > 0));
    }).trigger('blur');
    $('#searchform').keypress(function(e) {
        if (e.which == 13) {
            var str = $("#searchform").val();
            return strToAction(str);
        }
    });
    $(".btn-copy").on("click", function() {
        var btn = $(this);
        var target = btn.data("clipboardtarget");
        copyToClipboard($(target).val());
        btn.addClass("active").html("Copied!");
    });

    function underContruction() {
        $('.under_contruction').on("click", function() {
            Swal.fire('This function under contruction. Sorry for the inconvenience!');
        })
    }

    function strToAction(str) {
        var i = str,
            m = /shutterstock\.com\/([0-9a-zA-Z-\/]*)-([0-9]*)/,
            ist = /istockphoto\.com\/(.*)gm([0-9]*)-/;
        if (i.match(m)) {
            var match = i.match(m);
            var sid = match[2].split(/[-]+/).pop();
            return stocksearch(sid, 'st');
        }
        if (i.match(ist)) {
            var match = i.match(ist);
            var sid = match[2].split(/[-]+/).pop();
            return stocksearch(sid, 'ist');
        } else {
            var s = sts($("#searchform").val());
            window.location.replace("/s/" + s);
        }
        window.location.replace("/s/" + str);
    }

    function sts(t) {
        return t.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    }

    function stocksearch(id, site) {
        if (!siteConst.isMember) {
            Swal.fire({
                title: "Login to do this action!",
                html: "You have to <a href='/login'>login</a> " + siteConst.vhost + " first",
                icon: "error",
                showConfirmButton: true,
                confirmButtonText: "Go to login page",
                showLoaderOnConfirm: true,
                preConfirm: () => {
                    return window.location = "/login"
                }
            })
            return;
        }
        Swal.fire({
            title: 'Please wait few seconds',
            html: "setting up your place",
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
                var p = hjax({
                    id: id,
                    site: site
                }, '/tool/wheredoigo', 'get');
                p.done(function(data) {
                    if (data.success) {
                        window.location.replace(data.url);
                    }
                })
            }
        })
    }

    function loadLoginForm() {
        log("Load login form");
        $("[rel='get:Loginform']").on("click", function() {
            Swal.fire({
                didOpen: () => {
                    Swal.showLoading();
                    var a = hjax({}, '/login_modal', 'get').always(function(data) {
                        Swal.fire({
                            html: data.responseText,
                            showConfirmButton: false
                        })
                        require(['modules/user/login']);
                    });
                }
            });
        });
    }

    function socialshare() {
        $("body").find("img.socialshare").each(function() {
            var i = $(this),
                a = i.data('src'),
                t = i.data('title'),
                h = i.data('href'),
                e = '<div class="imgshare d-flex justify-content-end align-items-center">';
            pbtn = '<button title="Share to Pinterest" class="btn btn-pinterest btn-sm nh-share rounded-0" data-sharetitle="' + t + '" data-url="' + h + '" data-img="' + a + '" data-type="pinterest"><i class="fab fa-pinterest"></i></button>';
            tbtn = '<button title="Share to Twitter" class="btn btn-twitter btn-sm nh-share rounded-0" data-sharetitle="' + t + '" data-url="' + h + '" data-img="' + a + '" data-type="twitter"><i class="fab fa-twitter"></i></button>';
            e += tbtn + pbtn;
            e += '</div>';
            i.wrap("<div class='imgwrapper'></div>").after(e);
            i.removeClass('socialshare');
        });
    }

    function loadCss(cssId, cssUrl) {
        if (!document.getElementById(cssId)) {
            var head = document.getElementsByTagName('head')[0];
            var link = document.createElement('link');
            link.id = cssId;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = cssUrl;
            link.media = 'all';
            head.appendChild(link);
        }
    }

    function pageFocused() {
        var activeElement = document.activeElement.id;
        if (activeElement && activeElement != 'searchform') window.nh_quickActions = false;
        else window.nh_quickActions = true;
    }

    function hideEmptyAds() {
        $('body ins').on('DOMSubtreeModified', function() {
            var ad = $(this);
            if (ad.data('ad-status') == 'unfilled') {
                console.log("ad unfilled")
                reloadMasonry()
            }
        });
    }
    return {
        getSourceAndId: function(str) {
            const sourceMatch = [{
                match: /instagram\.com\/(p|reel)\/([0-9a-zA-Z-_]*)/,
                result: string => {
                    return {
                        source: 'instagram',
                        id: string[2].split(/[-]+/).pop(),
                        igPostType: string[1]
                    }
                }
            }, {
                match: /pinterest.com\/pin\/([0-9]*)/,
                result: string => {
                    return {
                        source: 'pinterest',
                        id: string[1].split(/[-]+/).pop()
                    }
                }
            }];
            let item = Object.assign([], sourceMatch).filter(item => str.match(item.match))
            if (item.length < 1) return false
            item = item.shift()
            let match = str.match(item.match)
            return item.result(match)
        },
        loadCss: function(cssId, cssUrl) {
            loadCss(cssId, cssUrl);
        },
        strToAction: function(str) {
            strToAction(str);
        },
        StockSearch: function(id, site) {
            stocksearch(id, site);
        },
        SocialShare: function() {
            log("Load SocialShare");
            socialshare();
        },
        processBtn: function(e) {
            var text = e.html();
            e.attr('restoreText', text);
            e.attr("disabled", true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> processing...');
        },
        restoreBtn: function(e) {
            var text = e.attr("restoreText");
            e.removeAttr("disabled").html(text);
        },
        analytics: function() {
            window.dataLayer = window.dataLayer || [];

            function gtag() {
                dataLayer.push(arguments);
            }
            gtag('js', new Date());
            gtag('config', 'UA-37164095-5');
        },
        displayGoogleAds: function() {
            $('ins').each(function() {
                (adsbygoogle = window.adsbygoogle || []).push({});
            })
            hideEmptyAds()
        },
        hideEmptyAds: function() {
            hideEmptyAds()
        },
        loadNotification: function() {
            $('#dropnoti').on('show.bs.collapse', function() {
                var l = $("#notiloading");
                var ct = $("#noticontent");
                var c = hjax({}, '/u/notis', 'get');
                c.done(function(data) {
                    l.hide();
                    if (data.count == 0) {
                        ct.html('Nothing new');
                    } else {
                        ns = data.notis;
                        var k = sn(ns);
                        ct.html(k);
                    }
                });
                c.always(function() {
                    if (me) {
                        hjax({}, '/u/resetnoti', 'put');
                    }
                    $(".badge-newnoti").hide();
                });
            })
        },
        quickActions: function() {
            setInterval(pageFocused, 300);
            $(document).on("keydown", function(e) {
                if (!nh_quickActions) return;
                var s = $("#searchform"),
                    i = $("input,textarea");
                var bq = document.activeElement;
                if (!i.is(":focus") && !bq.classList.contains('skipkeycode') && !e.ctrlKey) {
                    if (e.which == 67) {
                        e.preventDefault();
                        s.val('').focus();
                    }
                    if (e.which == 83) {
                        e.preventDefault();
                        s.focus();
                    }
                    if (e.which == 84) {
                        goto("#toantrang");
                    }
                }
            })
        },
        socialShare: function() {
            function t(t) {
                if (t > "") {
                    var i = screen.height * 0.4 / 2,
                        e = screen.width * 0.2 / 2;
                    w = screen.width * 0.8;
                    h = screen.height * 0.6;
                    return window.open(t, "sharer", "top=" + i + ",left=" + e + ",toolbar=0,status=0,width=" + w + ",height=" + h);
                }
            }

            function tw(l, title) {
                return t("https://twitter.com/intent/tweet?url=" + l + "&text=" + title);
            }

            function fb(l, title) {
                return t("https://www.facebook.com/sharer/sharer.php?u=" + l);
            }

            function pt(l, title, img) {
                return t("http://pinterest.com/pin/create/link/?url=" + l + "&media=" + encodeURIComponent(img) + "&description=" + title + "&note=" + title);
            }
            $(document).on("click", ".nh-share", function(e) {
                e.preventDefault();
                var img, type, title, l;
                var btn = $(this);
                img = btn.data("img") === undefined ? '' : btn.data("img");
                type = btn.data("type");
                title = btn.data("sharetitle");
                l = btn.data("url");
                if (type == 'pinterest') {
                    pt(l, title, img);
                } else if (type == 'facebook') {
                    fb(l, title);
                } else {
                    tw(l, title);
                }
            });
            $("body").find("img.socialshare").each(function() {
                var i = $(this),
                    a = i.data('src'),
                    t = i.data('title'),
                    h = i.data('href'),
                    e = '<div class="imgshare d-flex justify-content-end align-items-center">';
                pbtn = '<button title="Share to Pinterest" class="btn btn-pinterest btn-sm nh-share rounded-0" data-sharetitle="' + t + '" data-url="' + h + '" data-img="' + a + '" data-type="pinterest"><i class="fab fa-pinterest"></i></button>';
                tbtn = '<button title="Share to Twitter" class="btn btn-twitter btn-sm nh-share rounded-0" data-sharetitle="' + t + '" data-url="' + h + '" data-img="' + a + '" data-type="twitter"><i class="fab fa-twitter"></i></button>';
                e += tbtn + pbtn;
                e += '</div>';
                i.wrap("<div class='imgwrapper'></div>").after(e);
                i.removeClass('socialshare');
            });
        },
        FooterScripts: function() {
            underContruction();
            loadLoginForm();
        },
        spinner: function(t) {
            $('#main-spinner').css("display", t == "show" ? "flex" : "none");
        },
        uuid: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
    }
});
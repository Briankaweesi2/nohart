const csrf = $('meta[name="csrf-token"]').attr("content");

function log(c) {
    console.log(c)
};

function xulythongbao(data) {
    var stt = data.status;
    var dl = data.responseJSON;
    if (stt == '422') {
        $.each(dl.errors, function(key, value) {
            toastr.error(value, 'Error!', {
                positionClass: 'toast-bottom-right',
                timeOut: 3000
            });
        });
    }
    if (stt == '200') {
        $.each(dl.success, function(key, value) {
            if (value.type == 'license') {
                $('#license').html(value.license);
            }
        });
    }
}

function processBtn(e, processingMessage = 'processing') {
    var text = e.html();
    e.attr('restoreText', text);
    e.attr("disabled", true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> ' + processingMessage + '...');
}

function restoreBtn(e) {
    var text = e.attr("restoreText");
    e.removeAttr("disabled").html(text);
}

function thongbao(t, h1, h2 = '') {
    var p = 'toast-bottom-right';
    if (t == 'error') {
        toastr.error(h2, h1, {
            positionClass: p
        });
    } else {
        toastr.success(h2, h1, {
            positionClass: p
        });
    }
}

function strip_html_tags(str) {
    if ((str === null) || (str === ''))
        return false;
    else
        str = str.toString();
    return str.replace(/<[^>]*>/g, '');
}

function slugify(string) {
    const a = 'àáäâãåăæąçćčđďèéěėëêęğǵḧìíïîįłḿǹńňñòóöôœøṕŕřßşśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;'
    const b = 'aaaaaaaaacccddeeeeeeegghiiiiilmnnnnooooooprrsssssttuuuuuuuuuwxyyzzz------'
    const p = new RegExp(a.split('').join('|'), 'g')
    return string.toString().toLowerCase().replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a').replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e').replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i').replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o').replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u').replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y').replace(/đ/gi, 'd').replace(/\s+/g, '-').replace(p, c => b.charAt(a.indexOf(c))).replace(/&/g, '-and-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '')
}
var hjax = function(query, url, method) {
    query = (typeof query === 'undefined' ? {} : query);
    method = (typeof method === 'undefined' ? 'get' : method);
    $.extend(query, {
        '_token': csrf
    });
    return $.ajax({
        data: query,
        method: method,
        dataType: 'json',
        url: url
    });
}
var hload = function(id, url) {
    return $(id).load(url + '?_token=' + csrf)
}

function goto(e) {
    window.scrollTo(0, $(e).offset().top);
}

function adb_warning() {
    var n = "<div class='alert alert-danger d-block mt-3 text-center'><b>You are using AdBlock</b></div><p class='p-3'>Let disable AdBlock on this website to continue use helpful tools.</p><p class='p-3'>If you don't like Advertisement, please help us better by become VIP</p>"; - 1 != (img = getHelpImg()) ? n += '<img src="' + img + '" style="display:block;max-width:100%" />' : n += '<div class="dialog-buttons"><a href="' + e + '">' + t + "</a></div>", $(".abc").html(n)
}

function getHelpImg() {
    var e = window.navigator.userAgent,
        o = document.location.protocol + "//nohat.cc/";
    return -1 < e.indexOf("Chrome/") ? o += "/assets/chromeadblock.gif" : -1 < e.indexOf("Firefox/") ? o += "/assets/firefoxadblock.gif" : o = -1, o
}

function reloadMasonry() {
    window.msnry ? window.msnry.layout() : '';
}
var App = function() {
    var c = function(u) {
            if (me && (me.uname != u)) {
                var check = hjax({}, '/api/me/follow/' + u, 'get');
                check.done(function(data) {
                    if (data.followed == false) {
                        $("#followauthor").removeAttr("disabled");
                    } else {
                        $("#followauthor").removeAttr("disabled").addClass("active");
                    }
                })
            }
        },
        a = function(u) {
            $("#followauthor").on("click", function() {
                var btn = $('#followauthor');
                btn.button('toggle');
                let f = hjax({}, '/api/me/follow/' + u, 'put');
                f.done(function(data) {
                    if (data.success == true) {
                        if (btn.hasClass('active')) {
                            thongbao("success", 'Done!', 'User followed')
                        } else {
                            thongbao("success", 'Done!', 'Unfollow successfully')
                        }
                    } else {
                        thongbao('error', 'Error!', data.content)
                    }
                })
            });
        },
        sn = function(ns) {
            html = '';
            $.each(ns, function(index, n) {
                html += '<div class="media notification d-flex justify-content-start"><div class="user-thumb mr-3 rounded-thumb"> <img src="' + n.ava + '" width="50"></div><div class="notification-desc"><p>New ' + n.type + ' from <a href="/u/' + n.from + '" class="active-color">' + n.from + '</a></p><p><a href="' + n.target + '">' + n.content + '</a></p> <em class="inactive-color">' + n.added + '</em> <span class="adonis-icon close-notification"><i class="far fa-times-circle"></i></span></div></div>';
            });
            return html;
        },
        atg = function afterget() {
            $("a.edit-cm").on("click", function() {
                $('#main-spinner').css("display", "flex");
                var cid = $(this).attr('cm-id');
                var getOri = hjax({}, '/comment/post/' + postid + '/' + cid, 'get');
                getOri.done(function(data) {
                    $('#main-spinner').css("display", "none");
                    $('#addcomment').attr('cm-id', cid);
                    goto('#commentform');
                    comment.value(data.content);
                    $("#addcomment").html("Update Comment");
                });
            });
            $("a.del-cm").on("click", function() {
                $('#main-spinner').css("display", "flex");
                var cid = $(this).attr('cm-id');
                var del = hjax({}, '/comment/post/' + postid + '/' + cid, 'delete');
                del.done(function(data) {
                    $('#main-spinner').css("display", "none");
                    if (data.success == true) {
                        console.log(data);
                        cwrap = $('li.comment[cm-id="' + cid + '"]');
                        goto(cwrap);
                        cwrap.remove();
                    } else {
                        thongbao('error', 'Error!', 'Have something wrong, please try again');
                    }
                });
            });
        },
        scm = function showcomment(data) {
            var comments = data.comments,
                html = '';
            $.each(comments, function(index, comment) {
                var del_btn = '<a class="dropdown-item del-cm" cm-id="' + comment.id + '" href="javascript:void(0)">Delete</a>',
                    edit_btn = '<a class="dropdown-item edit-cm" cm-id="' + comment.id + '" href="javascript:void(0)">Edit</a>',
                    rp_btn = '<a class="dropdown-item" href="javascript:void(0)">Report</a>';
                var ab = '';
                if (comment.user === postauthor) {
                    var ab = '<span class="badge badge-success badge-comment-author">author</span>';
                }
                if (!me) {
                    var del = false,
                        edit = false;
                }
                if (me.uname == comment.user) {
                    var del = true,
                        edit = true;
                }
                var cr = '';
                if (edit == true) {
                    cr += edit_btn;
                }
                if (del == true) {
                    cr += del_btn;
                }
                cr += rp_btn;
                html += '<li cm-id="' + comment.id + '" class="comment d-flex align-self-center"><a class="float-left pr-3" href="/u/' + comment.user + '"><img class="comment-ava p-0" src="' + comment.ava + '" alt="avatar"></a><div class="comment-body" cm-id="' + comment.id + '"><div class="comment-heading justify-content-between d-flex"><div class="comment-left"><h4 class="comment-user m-0">' + comment.user + ' ' + ab + '</h4><span class="text-muted comment-time">' + comment.added + '</span></div><div class="dropdown comment-right"><button class="btn btn-link dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-ellipsis-h"></i></button><div cm-id="' + comment.id + '" class="dropdown-menu dropdown-menu-right" aria-labelledby="cm-' + comment.id + '">' + cr + '</div></div></div><div class="comment-content py-2">' + comment.content + '</div></div></li>';
            });
            return html;
        },
        gcm = function getcomment(start = false) {
            var cms = hjax({}, '/comment/post/' + postid + '?start=' + start, 'get');
            cms.done(function(data) {
                var start = data.start,
                    count = data.count,
                    html = scm(data);
                $(".comment-loading").hide();
                $("#comment").removeAttr("disabled");
                $("ul.comments-list").append(html);
                atg();
                if (start != false) {
                    $("#loadmore").show().attr('data-start', start);
                    $("#loadmore").html('<button class="btn btn-outline-primary btn-block">Loadmore</button>');
                } else {
                    $("#loadmore").html('<span class="text-muted">No more comments to load</span>');
                }
            });
        },
        lmcm = function() {
            $("#loadmore").on("click", function() {
                var start = $(this).attr('data-start');
                $(this).html('<button class="btn btn-primary btn-block" disabled><span class="spinner-grow spinner-grow-sm"></span>Loading..</button>');
                gcm(start);
            });
        },
        acm = function() {
            $("#addcomment").on("click", function(event) {
                event.preventDefault();
                var btn = $(this);
                btn.attr('disabled', true).html('<span class="spinner-grow spinner-grow-sm"></span>processing..');
                var c = comment.value(),
                    r = btn.attr('data-replyto'),
                    i = btn.attr('cm-id');
                if (i == '') {
                    p = hjax({
                        comment: c,
                        replyto: r
                    }, '/comment/post/' + postid, 'post');
                    p.done(function(data) {
                        if (data.comments) {
                            var cm = scm(data);
                            $("ul.comments-list").prepend(cm);
                        };
                        comment.value('');
                    });
                    p.fail(function(data) {
                        xulythongbao(data);
                    });
                    p.always(function() {
                        btn.removeAttr('disabled').html('ADD COMMENT');
                        atg();
                    });
                } else {
                    cwrap = $('li.comment[cm-id="' + i + '"]');
                    p = hjax({
                        comment: c
                    }, '/comment/post/' + postid + '/' + i, 'put');
                    p.done(function(data) {
                        if (data.success == true) {
                            $(cwrap).find(".comment-content").html(data.content);
                            toastr.success('Done!', 'Updated successfully', {
                                positionClass: 'toast-bottom-right',
                                timeOut: 3000
                            });
                            goto(cwrap);
                            comment.value("");
                            btn.removeAttr('disabled').attr('cm-id', '').html("ADD COMMENT");
                        }
                    });
                }
            });
        }
    return {
        Follow: function(u) {
            c(u), a(u);
        },
        Comment: function() {
            gcm(), atg(), lmcm(), acm();
        },
        GetComment: function(st) {
            gcm(st)
        },
        ShowComment: function(d) {
            scm(d);
        },
        SocialShare: function() {
            socialshare();
        }
    }
}();
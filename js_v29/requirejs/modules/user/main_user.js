define(['modules/thongbao', 'sweetalert', 'modules/jdenticon'], function(thongbao, Swal, jdenticon) {
    $(document).ready(function() {
        if (siteConst.logedIn == '1') {
            $("#notification").show();
            hjax({
                action: 'getnewnotification'
            }, '/u/' + siteConst.me.uname + '/actions', 'post').done(function(data) {
                if (data.success && data.newnoti > 0) {
                    $("#notification span").html(data.newnoti).show();
                }
            })
        }
        $("#notification").on("click", function() {
            var count = $("#notification span").html();
            Swal.fire({
                title: '<i class="far fa-bell"></i>',
                showConfirmButton: false,
                customClass: {
                    content: 'p-0'
                },
                didOpen: () => {
                    Swal.showLoading();
                    return hjax({
                        action: 'listnotification'
                    }, '/u/' + siteConst.me.uname + '/actions', 'post').done(function(data) {
                        if (data.success) {
                            Swal.update({
                                html: data.html
                            });
                            jdenticon.Load()
                        }
                    });
                }
            })
            if (count != '0') {
                hjax({
                    action: 'allnotificationreaded'
                }, '/u/' + siteConst.me.uname + '/actions', 'post');
                $("#notification span").html('0').hide();
            }
        })
    })
});
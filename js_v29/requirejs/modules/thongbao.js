define(['plugins/toastr.min', 'sweetalert'], function(toastr, Swal) {
    return {
        macdinh: function(t, h1, h2 = '', p = 'toast-bottom-right') {
            if (t == 'error') {
                toastr.error(h2, h1, {
                    positionClass: p
                });
            } else {
                toastr.success(h2, h1, {
                    positionClass: p
                });
            }
        },
        xulythongbao: function(data) {
            var stt = data.status;
            var dl = data.responseJSON;
            if (stt == '422') {
                $.each(dl.errors, function(key, value) {
                    $("#" + key).addClass("is-invalid");
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
        },
        swal: function(icon, title) {
            Swal.fire({
                icon: icon,
                title: title
            })
        }
    }
})
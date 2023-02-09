require.config({
    baseUrl: siteConst.assetsUrl + '/requirejs/',
    paths: {
        'jquery': '/js/jquery.min',
        'bootstrap': 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.bundle.min',
        'typehead': 'plugins/btags/typehead',
        'jquery-sticky': 'plugins/jquery.sticky',
        'datatables': 'https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min',
        'tagify': 'https://cdnjs.cloudflare.com/ajax/libs/tagify/3.22.1/jQuery.tagify.min',
        'cookiejs': 'https://cdn.jsdelivr.net/npm/js-cookie@rc/dist/js.cookie.min',
        'sweetalert': 'https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/10.13.0/sweetalert2.all'
    },
    shim: {
        'datatables': ['jquery', 'bootstrap'],
        'main': ['sweetalert'],
        'tagify': {
            deps: ["jquery"]
        }
    }
});
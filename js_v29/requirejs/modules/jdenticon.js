define(['https://cdn.jsdelivr.net/npm/jdenticon@3.1.0/dist/jdenticon.min.js'], function(jdenticon) {
    return {
        Load: function() {
            window.jdenticon_config = {
                padding: 0.0
            };
            jdenticon();
        }
    }
})
const mix = require("laravel-mix");
const path = require("path");

mix.alias({
    "@": "resources/js/src/",
})
    .js("resources/js/app.js", "public/js")
    // Core stable dependencies extracted to vendor.js for long-term browser caching.
    // These rarely change — users download them once and cache them indefinitely.
    .extract(["vue", "vue-router", "vue-meta", "vuex", "bootstrap-vue"], "public/js/vendor.js")
    .css("resources/css/app.css", "public/css")
    .vue();

mix.disableSuccessNotifications();

if (mix.inProduction()) {
    mix.version();
}

mix.webpackConfig({
    output: {
        chunkFilename: "js/chunk/[name].js?id=[chunkhash]",
    },
    optimization: {
        splitChunks: {
            chunks: "all",
            maxInitialRequests: 6,
            cacheGroups: {
                vendor: {
                    // Matches all stable core libs — vue, vue-router, vue-meta, vuex, bootstrap-vue
                    test: /[\\/]node_modules[\\/](vue|vue-router|vue-meta|vuex|bootstrap-vue)[\\/]/,
                    name: "vendor",
                    chunks: "initial",
                    priority: 20,
                },
                common: {
                    name: "common",
                    minChunks: 2,
                    chunks: "async",
                    priority: 10,
                    reuseExistingChunk: true,
                },
            },
        },
    },
});




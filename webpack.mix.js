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
    .vue({ extractStyles: true });

mix.disableSuccessNotifications();

if (mix.inProduction()) {
    mix.version();
}

mix.webpackConfig({
    output: {
        // The hash in the NAME, not a query string: the server ignores ?id=, so an open tab
        // from before a deploy was handed the new build's chunk under the old URL.
        chunkFilename: "js/chunk/[name].[chunkhash].js",
    },
    plugins: [
        // Last build's chunks go, so a stale tab gets a clean 404 (and reloads — router.js)
        // rather than a file from another build; and public/js/chunk does not grow forever.
        {
            apply: (compiler) => compiler.hooks.beforeRun.tap("CleanChunks", () =>
                require("fs").rmSync(path.join(__dirname, "public/js/chunk"), { recursive: true, force: true })),
        },
    ],
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
                // The chart library on its own (2026-11-15 frontend audit, FP1/FP2): two pages draw charts, and as a
                // module shared by two lazy pages it would otherwise sit in "common", which the public home page loads.
                charts: {
                    test: /[\\/]node_modules[\\/](apexcharts|vue-apexcharts)[\\/]/,
                    name: "charts",
                    chunks: "async",
                    priority: 30,
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




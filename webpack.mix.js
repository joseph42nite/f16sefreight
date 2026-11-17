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

// The old theme's stylesheet without the rules no page can use, about half of the stylesheet (build/purge-theme.js, which
// says exactly what counts as "can use"). Only the theme goes through it; every page's own styles are left alone.
mix.options({ postCss: [require("./build/purge-theme").plugin()] });

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
        // The list of icons the app uses is rewritten from the source before every compile (build/used-icons.js), so a
        // page that starts using a new one gets it without anyone remembering to add it.
        {
            apply: (compiler) => {
                const refresh = () => require("./build/used-icons").write();
                compiler.hooks.beforeRun.tap("UsedIcons", refresh);
                compiler.hooks.watchRun.tap("UsedIcons", refresh);
            },
        },
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
                // 🔴 Heavy libraries that only some signed-in screens use, each in a file of its own (2026-11-15 frontend
                // audit, FP1). As modules shared by two or more lazy pages they all sat in "common", which EVERY page
                // loads, the public home page included: 2.3 MB to show a landing page that uses none of them.
                // Each loads with the screens that import it, and with nothing else.
                editor: {       // the mail composer's rich-text editor
                    test: /[\\/]node_modules[\\/](tiptap[^\\/]*|prosemirror-[^\\/]+|highlight\.js|lowlight|orderedmap|rope-sequence|w3c-keyname)[\\/]/,
                    name: "editor", chunks: "async", priority: 30, enforce: true,
                },
                pdfSupport: {   // what the in-page PDF viewer needs besides pdf.js itself
                    test: /[\\/]node_modules[\\/](pdfvuer|web-streams-polyfill|dommatrix|buffer|base64-js|ieee754)[\\/]/,
                    name: "pdf-support", chunks: "async", priority: 30, enforce: true,
                },
                datepicker: {   // the waybill forms and the platform's shipments screen
                    test: /[\\/]node_modules[\\/](vue2-datepicker|vuejs-datepicker|date-format-parse)[\\/]/,
                    // The SCRIPT only. Its stylesheet stays where it was, in common.css, which is linked before app.css:
                    // the waybill forms restyle the picker there, and a picker stylesheet arriving later would win.
                    type: "javascript/auto",
                    name: "datepicker", chunks: "async", priority: 30, enforce: true,
                },
                alerts: {       // five platform admin pages
                    test: /[\\/]node_modules[\\/]sweetalert2[\\/]/,
                    name: "alerts", chunks: "async", priority: 30, enforce: true,
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




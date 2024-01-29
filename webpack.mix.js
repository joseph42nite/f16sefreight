const mix = require("laravel-mix");
const path = require("path");

mix.alias({
    "@": "resources/js/src/",
})
    .js("resources/js/app.js", "public/js")
    .css("resources/css/app.css", "public/css")
    .vue();

//disable save notification
mix.disableSuccessNotifications();

// mix.webpackConfig({
//     entry: {
//         chunkFilename: `js/chunk/[name].js?id=[chunkhash]`,
//     },
//     output: {
//         chunkFilename: `js/chunk/[name].js?id=[chunkhash]`,
//     },
//     resolve: {
//         alias: {
//             vue$: "vue/dist/vue.runtime.esm.js",
//             "@": path.resolve(__dirname, "resources/js/src/"),
//         },
//     },
//     // plugins: [
//     //     new BrowserSyncPlugin({
//     //         proxy: "http://lanceark.website",
//     //         host: "lanceark.website",
//     //         open: "external"
//     //     })
//     // ]
// });

/**
 * Frontend unit tests — Vue 2.7 + Jest 27.
 *
 * implementation_guide.md §8.3 and PRD §9.7 both referenced `npm run test:unit`,
 * but no runner, config or script existed. This is that runner.
 *
 * Jest 27 (not 29) and @vue/vue2-jest are deliberate: they are the maintained
 * pairing for the Vue 2 line. The app bundles with laravel-mix/webpack; Jest
 * transforms independently, so the two do not need to agree on tooling.
 */
module.exports = {
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['js', 'json', 'vue'],
    transform: {
        '^.+\\.js$': 'babel-jest',
        '^.+\\.vue$': '@vue/vue2-jest',
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/resources/js/src/$1',
        // A stylesheet imported from a page's script is nothing to a test; without this the page cannot be loaded.
        '\\.(css|scss)$': '<rootDir>/tests/js/styleStub.js',
    },
    // The default 5 s is too short for a mounted form while the machine is busy (a build, a video render): the
    // heavy specs failed on time alone and passed when run by themselves.
    testTimeout: 30000,
    testMatch: ['<rootDir>/tests/js/**/*.spec.js'],
    transformIgnorePatterns: ['/node_modules/(?!(bootstrap-vue|vue-treeselect)/)'],
};

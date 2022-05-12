const UserConfig = require('@11ty/eleventy/src/UserConfig');
const filters = require('./functions/filters');

/** @param {UserConfig} eleventyConfig */
module.exports = function (eleventyConfig) {
  filters(eleventyConfig);
  return {
    dir: {
      input: "templates/*.md.njk",
      output: "dist",
    },
    templateFormats: ["njk"],
  }
};

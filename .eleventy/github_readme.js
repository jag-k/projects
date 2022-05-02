module.exports = function (eleventyConfig) {
  return {
    dir: {
      input: "templates/*.md.njk",
      output: "dist",
    },
    templateFormats: ["njk"],
  }
};

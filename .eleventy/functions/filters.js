const UserConfig = require('@11ty/eleventy/src/UserConfig');

/**
 * @param projects {Project[]}
 * @param value {boolean}
 * */
const onMain =
  (projects, value = true) =>
    projects.filter(
      project => (project.onMain || false) === value
    )


/**
 * @param projects {Project[]}
 * @return {Project[]}
 * */
const sortByDate = (projects) => {
  /** @return {Date} */
  const getDate = project => {
    return project.date.to || project.date.since;
  };

  return projects.sort((a, b) => {
    if (!a.date.to) return 1;
    if (!b.date.to) return -1;
    return getDate(b) - getDate(a);
  });
}

/** @param {UserConfig} eleventyConfig */
module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("onMain", onMain);
  eleventyConfig.addFilter("sortByDate", sortByDate);
}

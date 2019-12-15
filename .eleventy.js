const root = 'src'; // Root folder
const { DateTime } = require("luxon");
const CleanCSS = require("clean-css");
const UglifyJS = require("uglify-es");
const htmlmin = require("html-minifier");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const slugify = require("slugify");
const Prism = require('prismjs');
const blogTools = require("eleventy-plugin-blog-tools");

module.exports = function(eleventyConfig) {
  eleventyConfig.addLayoutAlias("post", "layouts/post.njk");

	/* PLUGINS */
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(blogTools);
	eleventyConfig.addPlugin(pluginSyntaxHighlight, {
    templateFormats: ["md","html","njk"]
  });

  eleventyConfig.addFilter("slug", (input) => {
    const options = {
      replacement: "-",
      remove: /[&,+()$~%.'":*?!<>{}]/g,
      lower: true
    };
    return slugify(input, options);
  });

  eleventyConfig.addPlugin(pluginRss);

  /* SHORTCODES */

  eleventyConfig.addShortcode("figure", function(imageUrl, altText, caption, figureClass, imageClass, captionClass) {
    altText = altText || '';
    imageClass = imageClass || '';
    figureClass = figureClass || '';
    captionClass = captionClass || '';

    if (!caption) {
      return `<img src="${imageUrl}"${altText ? ' alt="'+altText+'"' : ''}${imageClass ? ' class="'+imageClass+'"' : ''}>`;
    }

    return `<figure${figureClass ? ' class="'+figureClass+'"' : ''}>
      <img src="${imageUrl}" alt="${altText}" ${imageClass ? ' class="'+imageClass+'"' : ''}>
      <figcaption${captionClass ? ' class="'+captionClass+'"' : ''}>${caption}</figcaption>
    </figure>`;
  });

  eleventyConfig.addPairedShortcode("callout", function(content) {
    const md = new markdownIt();
    return `<div class="callout u-padding u-border u-radius--half u-bg--secondary-max">
      <p>${ md.renderInline(content) }</p>
    </div>`;
  });

  /* LOCALISATION */

  // Sort a collection of pages for the navigation based on the locale's navSet setting
  eleventyConfig.addFilter('sortNavLocale', function(collection, navSet) {
    if (!Array.isArray(collection)) { return collection; }

    // Neat solution found on https://stackoverflow.com/a/44063445/3624336
    let collectionSorted = collection.slice().sort(function(a, b){
      return navSet.indexOf(a.fileSlug) - navSet.indexOf(b.fileSlug);
    });
    
    return collectionSorted;
  });

  eleventyConfig.addCollection("posts_all", function(collection) {
    return [].concat(
      collection.getFilteredByGlob("./src/en/posts/*.md"),
      collection.getFilteredByGlob("./src/fr/posts/*.md")
    );
  });

  // English
  eleventyConfig.addCollection("pages_en", function(collection) {
    return collection.getFilteredByGlob("./src/en/pages/*.md");
  });

  eleventyConfig.addCollection("posts_en", function(collection) {
    return collection.getFilteredByGlob("./src/en/posts/*.md");
  });

  // French
  eleventyConfig.addCollection("pages_fr", function(collection) {
    return collection.getFilteredByGlob("./src/fr/pages/*.md");
  });

  eleventyConfig.addCollection("posts_fr", function(collection) {
    return collection.getFilteredByGlob("./src/fr/posts/*.md");
  });

  /* DATES */

  // Date formatting (human readable)
  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj).toFormat("dd LLL yyyy");
  });

  // Date formatting (machine readable)
  eleventyConfig.addFilter("machineDate", dateObj => {
    return DateTime.fromJSDate(dateObj).toFormat("yyyy-MM-dd");
  });

  /* MINIFICATION */

  // Minify HTML/SVG
  eleventyConfig.addFilter("htmlmin", function(code) {
    return htmlmin.minify(code, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true
    });
  });

  // Minify CSS
  eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // Minify JS
  eleventyConfig.addFilter("jsmin", function(code) {
    let minified = UglifyJS.minify(code);
    if (minified.error) {
      console.log("UglifyJS error: ", minified.error);
      return code;
    }
    return minified.code;
  });

  // Minify HTML output
  // eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
  //   if (outputPath.endsWith(".html")) {
  //     let minified = htmlmin.minify(content, {
  //       useShortDoctype: true,
  //       removeComments: true,
  //       collapseWhitespace: true
  //     });
  //     return minified;
  //   }
  //   return content;
  // });

  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
    // Optional, default is "---"
    excerpt_separator: "<!-- excerpt -->"
  });

  // only content in the `posts/` directory
  eleventyConfig.addCollection("posts", function(collection) {
    return collection.getAllSorted().filter(function(item) {
      var postsRegExp = new RegExp("^\.\/"+(root ? (root+'/') : '')+"posts\/");
      return item.inputPath.match(postsRegExp) !== null;
    });
  });

  // Don't process folders with static assets e.g. images
  eleventyConfig.addPassthroughCopy(root+"/cms-editor");
  eleventyConfig.addPassthroughCopy({ [`${root}/_includes/assets/`]: "/assets/" });

  /* Markdown Plugins */
  let markdownIt = require("markdown-it");
  let markdownItAnchor = require("markdown-it-anchor");
  let options = {
    html: true,
    breaks: true,
    linkify: true
  };
  let opts = {
    permalink: false
  };

  eleventyConfig.setLibrary("md", markdownIt(options)
    .use(markdownItAnchor, opts)
  );

  return {
    templateFormats: ["md", "njk", "html", "liquid"],

    // If your site lives in a different subdirectory, change this.
    // Leading or trailing slashes are all normalized away, so don’t worry about it.
    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for URLs (it does not affect your file structure)
    pathPrefix: "/",

    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    passthroughFileCopy: true,
    dir: {
      input: "./src/",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};

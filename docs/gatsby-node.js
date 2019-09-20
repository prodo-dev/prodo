const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

const docsRoot = path.resolve(__dirname, "./content");

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  const docs = path.resolve(`./src/templates/Docs.tsx`);
  const docsSection = path.resolve(`./src/templates/DocsSection.tsx`);

  return graphql(
    `
      {
        allMdx(limit: 1000) {
          edges {
            node {
              id
              frontmatter {
                title
              }
              fields {
                slug
                section
              }
            }
          }
        }
      }
    `,
  ).then(result => {
    if (result.errors) {
      throw result.errors;
    }

    const posts = result.data.allMdx.edges;

    posts.forEach(post => {
      const slug = post.node.fields.slug.toLowerCase();
      createPage({
        path: slug,
        component: docs,
        context: {
          slug,
        },
      });
    });

    const sections = new Set();
    posts.forEach(post => {
      sections.add({
        name: post.node.fields.section.replace(/^\d+\_/, ""),
        fullName: post.node.fields.section,
      });
    });

    sections.forEach(section => {
      createPage({
        path: "/" + section.name.toLowerCase(),
        component: docsSection,
        context: {
          name: section.name,
          section: section.fullName,
        },
      });
    });
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `Mdx`) {
    const slug = createFilePath({ node, getNode })
      .replace(/^\/\d+\_/, "/")
      .toLowerCase();

    const section = path.dirname(
      path.relative(docsRoot, node.fileAbsolutePath),
    );

    createNodeField({
      name: "slug",
      node,
      value: slug,
    });

    createNodeField({
      name: "section",
      node,
      value: section,
    });
  }
};

const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

const docsRoot = path.resolve(__dirname, "./content");

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  const docs = path.resolve(`./src/templates/docs.tsx`);
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
      createPage({
        path: post.node.fields.slug,
        component: docs,
        context: {
          slug: post.node.fields.slug,
        },
      });
    });
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `Mdx`) {
    const slug = createFilePath({ node, getNode }).replace(/^\/\d+\_/, "/");

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

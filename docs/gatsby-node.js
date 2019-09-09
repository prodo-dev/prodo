const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

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
      console.log(post.node);
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
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
};

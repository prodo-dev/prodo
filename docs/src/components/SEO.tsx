import { graphql, useStaticQuery } from "gatsby";
import * as React from "react";
import Helmet from "react-helmet";

export interface Props {
  title?: string;
  description?: string;
}

interface QueryResult {
  site: {
    siteMetadata: {
      siteTitle: string;
      siteShortTitle: string;
      description: string;
      url: string;
      image?: string;
      twitter?: string;
    };
  };
}

function SEO(props: Props) {
  const data: QueryResult = useStaticQuery(query);
  const meta = data.site.siteMetadata;
  const description = props.description || meta.description;

  const title =
    props.title != null
      ? `${props.title} | ${meta.siteShortTitle}`
      : meta.siteTitle;

  return (
    <Helmet>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1"
      />

      {/* General tags */}
      <title>{title}</title>
      <meta name="description" content={description} />

      {meta.image && <meta name="image" content={meta.image} />}

      {/* OpenGraph tags */}
      <meta property="og:url" content={meta.url} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:site_name" content={meta.siteTitle} />
      <meta property="og:description" content={description} />
      {meta.image && <meta property="og:image" content={meta.image} />}

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:url" content={meta.url} />
      {meta.twitter && <meta name="twitter:site" content={meta.twitter} />}
      {meta.twitter && <meta name="twitter:creator" content={meta.twitter} />}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {meta.image && <meta name="twitter:image" content={meta.image} />}

      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.css"
      />

      <script src="https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.js" />
      <script type="text/javascript">
        {`
setTimeout(
  () =>
    window.cookieconsent.initialise({
      palette: {
        popup: {
          background: "#000000"
        },
        button: {
          background: "#00e3a0"
        }
      }
    }),
  1000
);
      `}
      </script>
    </Helmet>
  );
}

export default SEO;

const query = graphql`
  query {
    site {
      siteMetadata {
        siteTitle
        siteShortTitle
        description
        url
        image
        twitter
      }
    }
  }
`;

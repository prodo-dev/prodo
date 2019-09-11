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
      siteShortTitle: string;
      description: string;
      url: string;
      image?: string;
      userTwitter?: string;
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
      : meta.siteShortTitle;

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
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {meta.image && <meta property="og:image" content={meta.image} />}

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary" />
      <meta
        name="twitter:creator"
        content={meta.userTwitter ? meta.userTwitter : ""}
      />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {meta.image && <meta name="twitter:image" content={meta.image} />}
    </Helmet>
  );
}

export default SEO;

const query = graphql`
  query SEOQuery {
    site {
      siteMetadata {
        siteShortTitle
        description
        url
      }
    }
  }
`;

import * as React from "react";
import DocsLayout from "../components/DocsLayout";
import Link from "../components/Link";
import SEO from "../components/SEO";

const NotFoundPage = () => (
  <DocsLayout>
    <SEO title="404 - Page not found" />
    <h1>Page not found</h1>
    <p>Maybe you were looking for one of these pages?</p>
    <ul>
      <li>
        <Link to="/introduction/getting-started">Getting started</Link>{" "}
      </li>
      <li>
        <Link to="/api-reference">API reference</Link>{" "}
      </li>
    </ul>
  </DocsLayout>
);

export default NotFoundPage;

import { graphql, useStaticQuery } from "gatsby";
import * as React from "react";
import { useFlexSearch } from "react-use-flexsearch";
import styled from "styled-components";
import SearchIcon from "./SearchIcon";

export interface Props {
  onSearchResults: (results: string[] | null) => void;
}

const StyledSearchIcon = styled(SearchIcon)`
  position: absolute;
  top: 1.4rem;
  left: 1rem;
  max-width: 0.9rem;
  fill: #646464;
  pointer-events: none;
`;

const StyledSearch = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  appearance: none;
  padding: 1rem 0.5rem 1rem 2.6rem;
  background-color: transparent;
  border: none;
`;

const Search: React.FC<{ store: any; index: any } & Props> = ({
  store,
  index,
  onSearchResults,
}) => {
  const [query, setQuery] = React.useState<string>("");

  const results = useFlexSearch(query, index, store);
  React.useEffect(() => {
    onSearchResults(query === "" ? null : results.map(r => r.id));
  }, [query]);

  return (
    <StyledSearch>
      <StyledSearchIcon />
      <Input
        placeholder="Search"
        value={query}
        onChange={e => {
          setQuery(e.target.value);
          if (e.target.value === "") {
            onSearchResults(null);
          }
        }}
      />
    </StyledSearch>
  );
};

export default (props: Props) => {
  const { localSearchPages } = useStaticQuery(gqlQuery);

  return (
    <Search
      store={JSON.parse(localSearchPages.store)}
      index={localSearchPages.index}
      {...props}
    />
  );
};

const gqlQuery = graphql`
  query {
    localSearchPages {
      index
      store
    }
  }
`;

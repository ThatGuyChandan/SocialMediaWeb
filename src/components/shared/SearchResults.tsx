import GridPostList from "@/_root/pages/GridPostList";
import { Models } from "appwrite";
import Loader from "./Loader";

type SearchResultProps = {
  isSearchFetching: boolean;
  searchedPost: Models.Document[];
};
const SearchResults = ({
  isSearchFetching,
  searchedPost,
}: SearchResultProps) => {
  if (isSearchFetching) return <Loader />;
  if (searchedPost && searchedPost.documents.length > 0) {
    return <GridPostList posts={searchedPost.documents} />;
  }
  return (
    <p className="text-light-4 mt-10 text-center w-full">Nor result found</p>
  );
};

export default SearchResults;

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
  if (searchedPost && searchedPost.length > 0) {
    return <GridPostList posts={searchedPost} />;
  }
  return (
    <p className="text-light-4 mt-10 text-center w-full">No result found</p>
  );
};

export default SearchResults;

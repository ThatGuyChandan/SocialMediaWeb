import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import GridPostList from "./GridPostList";
import { useInView } from "react-intersection-observer";
import SearchResults from "@/components/shared/SearchResults";
import {
  useGetPosts,
  useSearchPosts,
} from "@/lib/react-query/queriesAndMutation";
import useDebounce from "@/Hooks/useDebounce";
import { Loader } from "lucide-react";

const Explore = () => {
  const { ref, inView } = useInView();
  const { data: posts, fetchNextPage, hasNextPage } = useGetPosts();
  const [searchValue, setSearchValue] = useState("");
  const deBounced = useDebounce(searchValue, 500);
  const { data: searchPosts, isFetching: isSearchFetching } =
    useSearchPosts(deBounced);
  useEffect(() => {
    if (inView && !searchValue) fetchNextPage();
  }, [inView, searchValue]);
  if (!posts) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }
  const shouldShowSearchResults = searchValue !== "";
  const shouldShowPosts =
    !shouldShowSearchResults &&
    posts.pages.every((item) => item.documents.length === 0);
  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h3 className="h3-bold md:h2-bold w-full">Search posts</h3>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img
            src="/assets/icons/search.svg"
            width={24}
            height={24}
            alt="search"
          />
          <Input
            type="text"
            placeholder="search here"
            className="explore-search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h4 className="body-bold md:h3-bold">Popular Search</h4>
        <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <img
            src="/assets/icons/filter.svg"
            width={20}
            height={20}
            alt="filter"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldShowSearchResults ? (
          <SearchResults
            isSearchFetching={isSearchFetching}
            searchedPost={searchPosts}
          />
        ) : shouldShowPosts ? (
          <p className="text-light-4 mt-10 text-center w-full">End of Posts</p>
        ) : (
          posts.pages.map((item, index) => (
            <GridPostList key={`page-${index}`} posts={item.documents} />
          ))
        )}
      </div>
      {hasNextPage && !searchValue && (
        <div ref={ref} className="mt-10">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Explore;

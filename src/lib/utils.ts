import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function formatSocialMediaDate(inputDate: string): string {
  const currentDate = new Date();
  const createdDate = new Date(inputDate);

  const timeDifference = currentDate.getTime() - createdDate.getTime();
  const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  if (daysAgo === 0) {
    const minutesAgo = Math.floor(timeDifference / (1000 * 60));
    if (minutesAgo < 1) {
      return "just now";
    } else if (minutesAgo < 60) {
      return `${minutesAgo} minute${minutesAgo > 1 ? "s" : ""} ago`;
    } else {
      return `${Math.floor(minutesAgo / 60)} hour${
        minutesAgo > 60 ? "s" : ""
      } ago`;
    }
  } else if (daysAgo < 10) {
    return `${daysAgo} day${daysAgo > 1 ? "s" : ""} ago`;
  } else {
    const day = createdDate.getDate();
    const month = createdDate.getMonth() + 1;
    const year = createdDate.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
export const checkIsLiked = (likeList: string[], userId: string) => {
  return likeList.includes(userId);
};
export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${formattedDate} at ${time}`;
}

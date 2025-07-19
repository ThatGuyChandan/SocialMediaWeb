import { INewPost, INewUser, IUpdatePost } from "@/types";
import { ID, Query } from "appwrite";
import { account, appwriteConfig, avatars, database, storage } from "./config";

export async function createUserAccount(user: INewUser) {
  try {
    // Create account with email verification (recommended for production)
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );
    
    if (!newAccount) throw Error;
    
    // Automatically sign in the user after account creation
    await account.createEmailSession(user.email, user.password);
    
    const avatarUrl = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.error("Error creating user account:", error);
    return null;
  }
}

// Function to verify email (call this when user clicks verification link)
export async function verifyEmail() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    const secret = urlParams.get('secret');
    
    if (userId && secret) {
      await account.updateVerification(userId, secret);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error verifying email:", error);
    return false;
  }
}

// Function to resend verification email
export async function resendVerification() {
  try {
    await account.createVerification('http://localhost:3000');
    return true;
  } catch (error) {
    console.error("Error resending verification:", error);
    return false;
  }
}

export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL;
  username?: string;
}) {
  try {
    const newUser = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );
    return newUser;
  } catch (error) {
    console.error("Error saving user to database:", error);
    console.error("Check if your database and collection are properly configured");
    return null;
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password);
    return session;
  } catch (error) {
    console.error("Error signing in:", error);
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    const currentUser = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [
        Query.equal("accountId", currentAccount.$id),
        "expand=save.post,save.post.creator",
      ]
    );
    if (!currentUser) throw Error;
    return currentUser.documents[0];
  } catch (error: any) {
    if (error.code === 401) {
      // Not logged in, just return null silently
      return null;
    }
    console.error("Error getting current user:", error);
    console.error("This might be due to permission issues. Check your Appwrite configuration.");
    return null;
  }
}

export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.error("Error signing out:", error);
    return error;
  }
}

export async function createPost(post: INewPost) {
  try {
    console.log("Creating post with file:", post.file[0]);
    
    const uploadedFile = await uploadFile(post.file[0]);
    if (!uploadedFile) {
      console.error("Failed to upload file");
      throw Error;
    }
    
    console.log("File uploaded successfully:", uploadedFile);
    
    const fileUrl = getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      console.error("Failed to get file preview URL");
      dleteFile(uploadedFile.$id);
      throw Error;
    }
    
    console.log("File URL generated:", fileUrl);
    
    const tags = post.tags?.replace(/ /g, "").split(",") || [];
    const newPost = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );
    
    if (!newPost) {
      console.error("Failed to create post document");
      await dleteFile(uploadedFile.$id);
      throw Error;
    }
    
    console.log("Post created successfully:", newPost);
    return newPost;
  } catch (error) {
    console.error("Error creating post:", error);
    return null;
  }
}

export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );
    return uploadedFile;
  } catch (error) {
    console.error("Error uploading file:", error);
    console.error("Check your storage bucket permissions and file security settings");
    return null;
  }
}

export function getFilePreview(fileId: string): string | null {
  try {
    // Use the SDK's getFileView method which handles project params automatically
    return storage.getFileView(appwriteConfig.storageId, fileId).href;
  } catch (error) {
    console.error("Error getting file preview:", error);
    return null;
  }
}

export async function dleteFile(fileId: string) {
  try {
    await storage.deleteFile(
      appwriteConfig.storageId,
      fileId
    );
    return { status: "OK" };
  } catch (error) {
    console.error("Error deleting file:", error);
    return null;
  }
}

export async function getRecentPosts() {
  try {
    const posts = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    );
    if (!posts) throw Error;
    return posts;
  } catch (error) {
    console.error("Error getting recent posts:", error);
    console.error("Check your database and collection permissions");
    return null;
  }
}

export async function likedPost(postId: string, likedArray: string[]) {
  try {
    const updatedPost = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likedArray,
      }
    );
    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.error("Error liking post:", error);
    return null;
  }
}
export async function savePost(postId: string, userId: string) {
  try {
    const updatedPost = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.saveCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );
    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}
export async function deleteSavedPost(saveRecordId: string) {
  try {
    const statusCode = await database.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.saveCollectionId,
      saveRecordId
    );
    if (!statusCode) throw Error;

    return { status: "OK" };
  } catch (error) {
    console.log(error);
  }
}

export async function getPostById(postId: string) {
  try {
    const post = await database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );
    return post;
  } catch (error) {
    console.log(error);
  }
}
export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0;

  try {
    let image = {
      imageUrl: post.imageUrl as string,
      imageId: post.imageId,
    };
    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error;
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        dleteFile(uploadedFile.$id);
        throw Error;
      }
      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    const tags = post.tags?.replace(/ /g, "").split(",") || [];
    const updatedPost = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );
    if (!updatedPost) {
      await dleteFile(post.imageId);
      throw Error;
    }
    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function deletePost(postId: string, imageId: string) {
  if (!postId || !imageId) throw Error;
  try {
    await database.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );
    return { status: "OK" };
  } catch (error) {
    console.log(error);
  }
}
export async function getInfinitePost({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(9)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}
export async function searchPost(searchTerm: string) {
  try {
    const posts = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search("caption", searchTerm)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}
export async function getUserById(userId: string) {
  try {
    const user = await database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    if (!user) throw Error;

    return user;
  } catch (error) {
    console.log(error);
  }
}

export async function createComment({ postId, userId, userName, content }: { postId: string; userId: string; userName: string; content: string }) {
  try {
    const comment = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      ID.unique(),
      {
        postId,
        userId,
        userName,
        content,
      }
    );
    return comment;
  } catch (error) {
    console.error("Error creating comment:", error);
    return null;
  }
}

export async function getCommentsByPostId(postId: string) {
  try {
    const comments = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      [Query.equal("postId", postId), Query.orderAsc("$createdAt")]
    );
    return comments;
  } catch (error) {
    console.error("Error fetching comments:", error);
    return null;
  }
}

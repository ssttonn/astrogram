import { INewUser } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { ID, ImageGravity, Query } from "appwrite";
import { URL } from "url";

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(ID.unique(), user.email, user.password, user.name);

    if (!newAccount) {
      throw Error;
    }

    const avatarUrl = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.name,
      username: user.username,
      imageUrl: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: string;
  username: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      user
    );

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailPasswordSession(user.email, user.password);
    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function signOutAccount() {
    try {
      const session = await account.deleteSession("current")

      return session
    } catch (error) {
      console.log(error)
    }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;
    const currentUser = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, [
      Query.equal("accountId", currentAccount.$id),
    ]);

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
}

export async function createPost(post: any) {
  try {
    const uploadedFile = await uploadFile(post.files[0]);

    if (!uploadedFile) {
      throw Error;
    }

    const fileUrl = getFilePreview(uploadedFile.$id);

    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }
    
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Create post
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      ID.unique(),
      {
        creators: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error);
  }
}

export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(appwriteConfig.storageId, ID.unique(), file)

    return uploadedFile
  } catch (error) {
    console.log(error)
  }
}

export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      ImageGravity.Top,
      100
    );

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function getRecentPosts() {
  try {
    const posts = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.postsCollectionId, [
      Query.orderDesc("$createdAt"), Query.limit(20)
    ])
  
    if (!posts) {
      throw Error
    }
  
    return posts
  } catch (error) {
    console.log(error)
  } 
}

export async function likePost(postId: string, likesArray: string[]) {
    try {
      const updatedPost = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postsCollectionId,
        postId,
        {
          likes: likesArray
        }
      )

      if (!updatedPost) {
        throw Error
      }

      return updatedPost
    } catch (error) {
      console.log(error)
    }
}

export async function savePost(postId: string, userId: string) {
  try {
    const savedRecord = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        post: postId,
        user: userId
      }
    )

    if (!savedRecord) {
      throw Error
    }

    return savedRecord
  } catch (error) {
    console.log(error)
  }
}
  
export async function deleteSavePost(documentId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      documentId
    )

    if (!statusCode) {
      throw Error
    }

    return {
      status: "ok"
    }
  } catch (error) {
    console.log(error)
  }
}
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  limit,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "@/lib/firebase"
import type { Category } from "@/types"

// Category functions
export const getCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "categories"))
    const categories: Category[] = []

    querySnapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() } as Category)
    })

    return categories
  } catch (error) {
    console.error("Error getting categories:", error)
    return []
  }
}

export const getCategory = async (categoryId: string) => {
  try {
    const docRef = doc(db, "categories", categoryId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Category
    } else {
      throw new Error("Category not found")
    }
  } catch (error) {
    console.error("Error getting category:", error)
    throw error
  }
}

export const getCategoryBySlug = async (slug: string, language: string) => {
  try {
    const slugField = `slug.${language}`
    const q = query(collection(db, "categories"), where(slugField, "==", slug), limit(1))

    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0]
      return { id: doc.id, ...doc.data() } as Category
    } else {
      return null
    }
  } catch (error) {
    console.error("Error getting category by slug:", error)
    return null
  }
}

export const getChildCategories = async (parentId: string) => {
  try {
    const q = query(collection(db, "categories"), where("parentId", "==", parentId))
    const querySnapshot = await getDocs(q)
    const categories: Category[] = []

    querySnapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() } as Category)
    })

    return categories
  } catch (error) {
    console.error("Error getting child categories:", error)
    return []
  }
}

export const createCategory = async (category: Omit<Category, "id" | "createdAt" | "updatedAt">) => {
  try {
    const docRef = await addDoc(collection(db, "categories"), {
      ...category,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return { id: docRef.id, ...category }
  } catch (error) {
    console.error("Error creating category:", error)
    throw error
  }
}

export const updateCategory = async (categoryId: string, category: Partial<Category>) => {
  try {
    const docRef = doc(db, "categories", categoryId)
    await updateDoc(docRef, {
      ...category,
      updatedAt: serverTimestamp(),
    })

    return { id: categoryId, ...category }
  } catch (error) {
    console.error("Error updating category:", error)
    throw error
  }
}

export const deleteCategory = async (categoryId: string) => {
  try {
    await deleteDoc(doc(db, "categories", categoryId))
    return { success: true }
  } catch (error) {
    console.error("Error deleting category:", error)
    throw error
  }
}

export const uploadCategoryImage = async (file: File, categoryId: string) => {
  try {
    const storageRef = ref(storage, `categories/${categoryId}/${file.name}`)
    await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(storageRef)
    return downloadURL
  } catch (error) {
    console.error("Error uploading category image:", error)
    throw error
  }
}

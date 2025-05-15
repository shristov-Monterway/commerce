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
  orderBy,
  limit as firestoreLimit,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "@/lib/firebase"
import type { Product } from "@/types"

// Product functions
export const getProducts = async (categoryId?: string, limit = 20) => {
  try {
    let q
    if (categoryId) {
      q = query(
        collection(db, "products"),
        where("categoryIds", "array-contains", categoryId),
        orderBy("createdAt", "desc"),
        firestoreLimit(limit),
      )
    } else {
      q = query(collection(db, "products"), orderBy("createdAt", "desc"), firestoreLimit(limit))
    }

    const querySnapshot = await getDocs(q)
    const products: Product[] = []

    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product)
    })

    return products
  } catch (error) {
    console.error("Error getting products:", error)
    throw error
  }
}

export const getProductsByCategory = async (categoryId: string, limit = 100) => {
  try {
    const q = query(
      collection(db, "products"),
      where("categoryIds", "array-contains", categoryId),
      orderBy("createdAt", "desc"),
      firestoreLimit(limit),
    )

    const querySnapshot = await getDocs(q)
    const products: Product[] = []

    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product)
    })

    return products
  } catch (error) {
    console.error("Error getting products by category:", error)
    return []
  }
}

export const getProduct = async (productId: string) => {
  try {
    const docRef = doc(db, "products", productId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product
    } else {
      throw new Error("Product not found")
    }
  } catch (error) {
    console.error("Error getting product:", error)
    throw error
  }
}

export const getProductById = async (productId: string) => {
  try {
    const docRef = doc(db, "products", productId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product
    } else {
      return null
    }
  } catch (error) {
    console.error("Error getting product:", error)
    return null
  }
}

export const getProductBySlug = async (slug: string, language: string) => {
  try {
    const slugField = `slug.${language}`
    const q = query(collection(db, "products"), where(slugField, "==", slug), firestoreLimit(1))

    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0]
      return { id: doc.id, ...doc.data() } as Product
    } else {
      return null
    }
  } catch (error) {
    console.error("Error getting product by slug:", error)
    return null
  }
}

export const createProduct = async (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
  try {
    const docRef = await addDoc(collection(db, "products"), {
      ...product,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return { id: docRef.id, ...product }
  } catch (error) {
    console.error("Error creating product:", error)
    throw error
  }
}

export const updateProduct = async (productId: string, product: Partial<Product>) => {
  try {
    const docRef = doc(db, "products", productId)
    await updateDoc(docRef, {
      ...product,
      updatedAt: serverTimestamp(),
    })

    return { id: productId, ...product }
  } catch (error) {
    console.error("Error updating product:", error)
    throw error
  }
}

export const deleteProduct = async (productId: string) => {
  try {
    await deleteDoc(doc(db, "products", productId))
    return { success: true }
  } catch (error) {
    console.error("Error deleting product:", error)
    throw error
  }
}

export const uploadProductImage = async (file: File, productId: string) => {
  try {
    const storageRef = ref(storage, `products/${productId}/${file.name}`)
    await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(storageRef)
    return downloadURL
  } catch (error) {
    console.error("Error uploading product image:", error)
    throw error
  }
}

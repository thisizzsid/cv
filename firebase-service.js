import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  serverTimestamp,
  orderBy,
} from 'firebase/firestore';
import { db, auth } from './firebase-config';

// Save or update a resume
export const saveResume = async (resumeData, resumeId = null) => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");

    const resumeDocData = {
      ...resumeData,
      userId,
      updatedAt: serverTimestamp(),
    };

    if (resumeId) {
      // Update existing
      await updateDoc(doc(db, 'resumes', resumeId), resumeDocData);
      return resumeId;
    } else {
      // Create new
      resumeDocData.createdAt = serverTimestamp();
      const docRef = await addDoc(collection(db, 'resumes'), resumeDocData);
      return docRef.id;
    }
  } catch (error) {
    console.error('Error saving resume:', error);
    throw error;
  }
};

// Get all resumes for current user
export const getUserResumes = async () => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");

    const q = query(
      collection(db, 'resumes'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting resumes:', error);
    throw error;
  }
};

// Get single resume
export const getResume = async (resumeId) => {
  try {
    const docRef = doc(db, 'resumes', resumeId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      throw new Error("Resume not found");
    }
  } catch (error) {
    console.error('Error getting resume:', error);
    throw error;
  }
};

// Delete a resume
export const deleteResume = async (resumeId) => {
  try {
    await deleteDoc(doc(db, 'resumes', resumeId));
  } catch (error) {
    console.error('Error deleting resume:', error);
    throw error;
  }
};

// Save resume to local storage as backup
export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to local storage:', error);
  }
};

// Load resume from local storage
export const loadFromLocalStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading from local storage:', error);
    return null;
  }
};

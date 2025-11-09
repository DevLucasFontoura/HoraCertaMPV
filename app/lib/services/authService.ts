import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
  deleteUser
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where
} from 'firebase/firestore';
import { auth, db } from '../firebase';

export interface UserData {
  createdAt: string;
  email: string;
  name: string;
  workHours: number;
  lunchHours: number;
  plan: string;
}

export class AuthService {
  // Registrar novo usuário
  static async registerUser(email: string, password: string, userData: UserData): Promise<UserCredential> {
    try {
      // Criar usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Salvar dados adicionais no Firestore com o mesmo ID do usuário
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userDocRef, {
        ...userData,
        uid: userCredential.user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      return userCredential;
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      throw error;
    }
  }

  // Fazer login
  static async loginUser(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  }

  // Fazer logout
  static async logoutUser(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  }

  // Buscar dados do usuário no Firestore
  static async getUserData(uid: string): Promise<UserData | null> {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        return userDoc.data() as UserData;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      throw error;
    }
  }

  // Atualizar dados do usuário no Firestore
  static async updateUserData(uid: string, userData: Partial<UserData>): Promise<void> {
    try {
      const userDocRef = doc(db, 'users', uid);
      await setDoc(userDocRef, {
        ...userData,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
      throw error;
    }
  }

  // Deletar todos os registros do usuário na coleção 'registros'
  static async deleteAllUserRegistros(uid: string): Promise<void> {
    try {
      const registrosRef = collection(db, 'registros');
      const q = query(registrosRef, where('userId', '==', uid));
      const querySnapshot = await getDocs(q);
      const batchDeletes: Promise<void>[] = [];
      querySnapshot.forEach((docSnap) => {
        batchDeletes.push(deleteDoc(docSnap.ref));
      });
      await Promise.all(batchDeletes);
    } catch (error) {
      console.error('Erro ao deletar registros do usuário:', error);
      throw error;
    }
  }

  // Deletar conta do usuário
  static async deleteUserAccount(): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Nenhum usuário autenticado');
      }
      const uid = user.uid; // Salvar o uid antes de deletar

      console.log('[DeleteAccount] Tentando deletar usuário do Authentication:', uid);
      await deleteUser(user);
      console.log('[DeleteAccount] Usuário do Authentication deletado com sucesso:', uid);

      try {
        console.log('[DeleteAccount] Tentando deletar todos os registros do usuário:', uid);
        await AuthService.deleteAllUserRegistros(uid);
        console.log('[DeleteAccount] Registros do usuário deletados com sucesso:', uid);
      } catch (regError) {
        console.error('[DeleteAccount] Erro ao deletar registros do usuário:', regError);
      }

      try {
        console.log('[DeleteAccount] Tentando deletar documento do usuário na coleção users:', uid);
        const userDocRef = doc(db, 'users', uid);
        await deleteDoc(userDocRef);
        console.log('[DeleteAccount] Documento do usuário deletado com sucesso:', uid);
      } catch (userDocError) {
        console.error('[DeleteAccount] Erro ao deletar documento do usuário:', userDocError);
      }
    } catch (error) {
      console.error('Erro ao deletar conta do usuário:', error);
      throw error;
    }
  }
} 
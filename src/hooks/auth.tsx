import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

type User = {
  id: string;
  name: string;
  isAdmin: boolean;
}

type AuthContextData = {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  forgoutPassword: (email: string) => Promise<void>;
  isLogging: boolean;
  user: User | null;
}

type AuthProviderProps = {
  children: ReactNode;
}

const USER_COLLECTION = '@gopizza:users';

const AuthContext = createContext({} as AuthContextData);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLogging, setIsLogging] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const signIn = async (email: string, password: string) => {
    try {
      if(!email || !password) {
        return Alert.alert('Login', 'Informe o e-mail e a senha.')
      }
  
      setIsLogging(true);
  
      const account = await auth().signInWithEmailAndPassword(email, password);

      const profile = await firestore().collection('users').doc(account.user.uid).get();

      const { name, isAdmin } = profile.data() as User;
      
      if(profile.exists) {
        const userData = {
          id: account.user.uid,
          name,
          isAdmin
        }

        await AsyncStorage.setItem(USER_COLLECTION, JSON.stringify(userData));

        setUser(userData);
      }
    } catch (error: any) {
      const authError = {
        [error.code]: 'Não foi possível realizar o login',
        'auth/user-not-found': 'Usuário não encontrado',
        'auth/wrong-password': 'Senha inválida'
      }

      Alert.alert('Login', authError[error.code]);

      console.error(error);
    } finally {
      setIsLogging(false);
    }
  }

  const loadUserStorageData = async () => {
    try {
      setIsLogging(true);

      const storedUser = await AsyncStorage.getItem(USER_COLLECTION);

      if (storedUser) {
        const userData = JSON.parse(storedUser) as User;
        setUser(userData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLogging(false);
    }
  }

  const signOut = async () => {
    await auth().signOut();
    await AsyncStorage.removeItem(USER_COLLECTION);

    setUser(null);
  }

  const forgoutPassword = async (email: string) => {
    try {
      if(!email) return Alert.alert('Redefinir senha', 'Informe o e-mail');

      await auth().sendPasswordResetEmail(email)

      Alert.alert('Redefinir senha', 'Enviamos um link no seu e-mail para redefinição da senha.')
    } catch (error) {
      Alert.alert('Redefinir senha', 'Ocorreu um erro no envio do e-mail de redefinição da senha.')

      console.error(error)
    }
  }

  useEffect(() => {
    loadUserStorageData();
  }, []);

  return (
    <AuthContext.Provider value={{ signIn, user, isLogging, signOut, forgoutPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth }
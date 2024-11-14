"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { auth, firestore } from "@/lib/firebase/firebaseConfig";
import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";

interface UserData {
  id: string;
  nama: string;
  email: string;
  role: string;
}

interface BusinessData {
  id: string;
  name: string;
  phone: string;
  active: Timestamp;
  regional?: [];
}

interface AuthContextType {
  userData: UserData | null;
  businessData: BusinessData | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("idToken");
    console.log(token);
    if (!token) {
      setBusinessData(null);
      setUserData(null);
      setLoading(false);
      return;
    }

    const decoded = jwt.decode(token) as JwtPayload & { user_id: string };
    const userId = decoded.user_id;

    const fetchUserData = async () => {
      try {
        const businessesRef = collection(firestore, "businesses");
        const allBusinessesSnapshot = await getDocs(businessesRef);
        let foundBusinessData: BusinessData | null = null;

        for (const businessDoc of allBusinessesSnapshot.docs) {
          const accountsRef = collection(businessDoc.ref, "accounts");
          const docRef = doc(accountsRef, userId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            foundBusinessData = {
              ...(businessDoc.data() as BusinessData),
              id: businessDoc.id,
            };
            const userDocData = docSnap.data() as UserData;
            setUserData({
              ...userDocData,
              id: docSnap.id,
            });
            break;
          }
        }

        if (foundBusinessData) {
          setBusinessData(foundBusinessData);
          console.log("Found business data:", foundBusinessData);
        } else {
          console.log("No matching document found in accounts subcollection.");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ userData, businessData, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

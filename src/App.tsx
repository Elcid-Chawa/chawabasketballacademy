/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { useState, useEffect, createContext, useContext, Component } from "react";
import { Search, ChevronRight, ChevronLeft, ChevronDown, ChevronUp, MapPin, Users, Trophy, LogIn, LogOut, User, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { auth, db } from "./firebase";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut, 
  User as FirebaseUser 
} from "firebase/auth";
import { 
  collection, 
  doc, 
  setDoc, 
  getDocFromServer, 
  serverTimestamp,
  Timestamp
} from "firebase/firestore";

// --- Error Handling ---

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// --- Components ---

class ErrorBoundary extends React.Component<any, any> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  render() {
    if ((this.state as any).hasError) {
      return (
        <div className="min-h-screen bg-academy-dark flex items-center justify-center p-4 text-center">
          <div className="max-w-md w-full bg-academy-gray p-8 rounded-2xl border border-red-500/20">
            <AlertCircle className="text-red-500 w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-white mb-2 uppercase">Something went wrong</h2>
            <p className="text-gray-400 mb-6 text-sm">
              {(this.state as any).error?.message?.includes('authInfo') 
                ? "You don't have permission to perform this action. Please check your account."
                : "An unexpected error occurred. Please try refreshing the page."}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-academy-gold text-academy-dark px-6 py-3 rounded-full font-bold uppercase text-xs tracking-widest"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    const self = this as any;
    return self.props.children;
  }
}

const AuthContext = createContext<{
  user: FirebaseUser | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

const FirebaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const Navbar = () => {
  const { user, login, logout, loading } = useContext(AuthContext);

  return (
    <nav id="navbar" className="bg-academy-dark/90 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-academy-gold rounded-full flex items-center justify-center font-bold text-academy-dark text-[10px] text-center leading-tight p-1 bg-[url('logo.png')] bg-cover bg-center">
                CHABA
              </div>
            </div>
            <div className="hidden md:block">
              <div className="flex items-baseline space-x-6">
                {["ABOUT", "LIMBE CAMPUS", "FOUNDERS", "REGIONAL LEAGUE", "NEWS", "CONTACT"].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-gray-300 hover:text-academy-gold px-3 py-2 text-xs font-bold tracking-widest transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button id="search-button" className="text-gray-400 hover:text-white p-2">
              <Search size={20} />
            </button>
            
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:block text-right">
                  <p className="text-[10px] font-bold text-white uppercase tracking-widest leading-none">{user.displayName}</p>
                  <button onClick={logout} className="text-[9px] text-academy-gold uppercase tracking-widest hover:underline">Logout</button>
                </div>
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full border border-academy-gold/30" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-academy-gold flex items-center justify-center text-academy-dark">
                    <User size={20} />
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={login}
                className="flex items-center gap-2 bg-academy-gold text-academy-dark px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors"
              >
                <LogIn size={14} /> Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => (
  <section id="hero" className="relative py-32 px-4 overflow-hidden basketball-pattern bg-[url('https://picsum.photos/seed/limbe-beach/1920/1080?blur=2')] bg-cover bg-center">
    <div className="absolute inset-0 bg-academy-dark/80" />
    <div className="max-w-5xl mx-auto text-center relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-academy-gold/20 border border-academy-gold/30 text-academy-gold text-xs font-bold tracking-[0.2em] uppercase mb-8"
      >
        <MapPin size={14} /> Limbe, Southwest Region, Cameroon
      </motion.div>
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase mb-8 leading-[0.9]"
      >
        CHAWA's <span className="text-academy-gold">BASKETBALL</span> ACADEMY
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed max-w-3xl mx-auto"
      >
        Empowering the next generation of Cameroonian athletes. An initiative by Elcid Chawa and Ida Chawa, dedicated to excellence on and off the court.
      </motion.p>
    </div>
  </section>
);

const RegistrationForm = () => {
  const { user, login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ age: "", position: "Guard" });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setStatus('submitting');
    const path = `players/${user.uid}`;
    try {
      await setDoc(doc(db, "players", user.uid), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        age: parseInt(formData.age),
        position: formData.position,
        createdAt: serverTimestamp()
      });
      setStatus('success');
    } catch (error) {
      setStatus('error');
      try {
        handleFirestoreError(error, OperationType.WRITE, path);
      } catch (e: any) {
        setErrorMessage(e.message);
      }
    }
  };

  if (!user) {
    return (
      <div className="bg-academy-gray p-12 text-center rounded-3xl border border-white/5">
        <Users className="text-academy-gold w-16 h-16 mx-auto mb-6" />
        <h3 className="text-2xl font-black text-white uppercase mb-4">Join the Academy</h3>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">Sign in with your Google account to register as a player and start your journey with Chawa Academy.</p>
        <button 
          onClick={login}
          className="bg-academy-gold text-academy-dark px-8 py-4 rounded-full font-bold uppercase text-xs tracking-[0.2em] hover:bg-white transition-colors flex items-center gap-3 mx-auto"
        >
          <LogIn size={18} /> Sign In to Register
        </button>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="bg-academy-gray p-12 text-center rounded-3xl border border-academy-gold/20">
        <CheckCircle2 className="text-academy-gold w-16 h-16 mx-auto mb-6" />
        <h3 className="text-2xl font-black text-white uppercase mb-4">Registration Complete</h3>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">Welcome to the family, {user.displayName}! Our coaching staff will review your profile and contact you soon.</p>
        <button 
          onClick={() => setStatus('idle')}
          className="text-academy-gold font-bold uppercase text-[10px] tracking-widest hover:underline"
        >
          Update Registration
        </button>
      </div>
    );
  }

  return (
    <div className="bg-academy-gray p-12 rounded-3xl border border-white/5">
      <h3 className="text-2xl font-black text-white uppercase mb-8 text-center">Player Registration</h3>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Age</label>
          <input 
            type="number" 
            required
            min="5"
            max="40"
            value={formData.age}
            onChange={(e) => setFormData({...formData, age: e.target.value})}
            className="w-full bg-academy-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-academy-gold outline-none transition-colors"
            placeholder="Enter your age"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Preferred Position</label>
          <select 
            value={formData.position}
            onChange={(e) => setFormData({...formData, position: e.target.value})}
            className="w-full bg-academy-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-academy-gold outline-none transition-colors"
          >
            <option value="Guard">Guard</option>
            <option value="Forward">Forward</option>
            <option value="Center">Center</option>
          </select>
        </div>
        
        {status === 'error' && (
          <div className="flex items-center gap-2 text-red-500 text-xs bg-red-500/10 p-4 rounded-xl border border-red-500/20">
            <AlertCircle size={16} />
            <p>Registration failed. {errorMessage.includes('insufficient permissions') ? "Permission denied." : "Please try again."}</p>
          </div>
        )}

        <button 
          type="submit"
          disabled={status === 'submitting'}
          className="w-full bg-academy-gold text-academy-dark py-4 rounded-full font-bold uppercase text-xs tracking-[0.2em] hover:bg-white transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {status === 'submitting' ? (
            <>
              <Loader2 className="animate-spin" size={18} /> Submitting...
            </>
          ) : (
            "Complete Registration"
          )}
        </button>
      </form>
    </div>
  );
};

const FeatureRow = ({ title, description, image, reverse = false, goldBg = false }: { title: string, description: string, image: string, reverse?: boolean, goldBg?: boolean }) => (
  <section className={`flex flex-col md:flex-row min-h-[500px] max-h-screen ${reverse ? 'md:flex-row-reverse' : ''}`}>
    <div className={`flex-1 flex flex-col justify-center items-center p-12 text-center relative ${goldBg ? 'bg-academy-gold text-academy-dark' : 'bg-academy-gray text-white'}`}>
      <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight max-w-md mb-6 leading-tight">
        {title}
      </h2>
      <p className="text-lg opacity-90 mb-8 max-w-sm font-light">
        {description}
      </p>
      <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-4">
        EXPLORE THE INITIATIVE
      </p>
      <div className={`absolute ${reverse ? 'left-0' : 'right-0'} top-1/2 -translate-y-1/2 hidden md:block`}>
        {reverse ? <ChevronLeft size={48} className="text-white/20" /> : <ChevronRight size={48} className="text-black/20" />}
      </div>
    </div>
    <div className="flex-1 h-[400px] md:h-auto overflow-hidden">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
        referrerPolicy="no-referrer"
      />
    </div>
  </section>
);

const InfoCard = ({ title, icon: Icon, image }: { title: string, icon: any, image: string }) => (
  <div className="group cursor-pointer">
    <div className="relative aspect-[4/5] overflow-hidden bg-academy-gray">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-academy-dark/40 group-hover:bg-transparent transition-colors" />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
        <Icon size={48} className="text-academy-gold mb-4 transform group-hover:scale-110 transition-transform" />
        <h3 className="text-white font-black uppercase tracking-tight text-xl">
          {title}
        </h3>
      </div>
    </div>
    <div className="bg-academy-gold p-4 text-center">
      <p className="text-academy-dark font-bold uppercase tracking-widest text-[10px]">
        LEARN MORE
      </p>
    </div>
  </div>
);

function AppContent() {
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. ");
        }
      }
    }
    testConnection();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <Hero />

        <section className="py-24 px-4 bg-academy-dark">
          <div className="max-w-4xl mx-auto">
            <RegistrationForm />
          </div>
        </section>

        <FeatureRow
          title="MEET THE FOUNDERS: ELCID & IDA CHAWA"
          description="A vision born from passion. Elcid and Ida Chawa established this academy to provide world-class basketball training right here in Limbe."
          image="images/founder-academy.jpeg"
          goldBg
        />

        <FeatureRow
          title="SOUTHWEST REGION LEAGUE SUPPORT"
          description="Proudly supported by the Southwest Region League Federation, ensuring our athletes are integrated into the national basketball ecosystem."
          image="https://picsum.photos/seed/cameroon-basketball/800/1000"
          reverse
        />

        <FeatureRow
          title="COASTAL EXCELLENCE IN LIMBE"
          description="Training at the foot of Mount Cameroon, our academy leverages the unique energy of the Southwest Region to build champions."
          image="https://picsum.photos/seed/limbe-coast/800/1000"
          goldBg
        />

        <section
          id="logo-section"
          className="py-32 bg-academy-dark flex flex-col items-center border-y border-white/5 basketball-pattern"
        >
          <div className="relative w-72 h-72 md:w-96 md:h-96 border-4 border-academy-gold rounded-full flex items-center justify-center p-12 text-center">
            <div className="absolute -top-4 bg-academy-dark px-4 text-academy-gold font-bold text-xl tracking-tighter">
              SOUTHWEST
            </div>
            <div className="text-academy-gold font-black text-5xl md:text-6xl leading-none">
              CHAWA
              <br />
              <span className="text-2xl md:text-3xl tracking-[0.2em]">
                ACADEMY
              </span>
            </div>
            <div className="absolute -bottom-4 bg-academy-dark px-4 text-academy-gold font-bold text-xl tracking-tighter">
              CAMEROON
            </div>
          </div>
          <div className="mt-12 text-center">
            <p className="text-gray-500 font-bold tracking-[0.3em] uppercase text-xs">
              Official Partner of the Southwest Region League Federation
            </p>
          </div>
        </section>

        <section id="grid-section" className="py-24 px-4 bg-academy-dark">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <InfoCard
              title="ELITE TRAINING"
              icon={Trophy}
              image="/images/athlete.jpeg"
            />
            <InfoCard
              title="COMMUNITY IMPACT"
              icon={Users}
              image="/images/players.jpeg"
            />
            <InfoCard
              title="REGIONAL PATH"
              icon={MapPin}
              image="/images/chabagames.jpeg"
            />
          </div>
        </section>
      </main>

      <footer id="footer" className="bg-academy-dark">
        <div className="bg-academy-gold py-16 flex flex-col items-center">
          <div className="w-20 h-20 bg-academy-dark rounded-full flex items-center justify-center font-bold text-academy-gold text-xs text-center leading-tight p-2 mb-6">
            CHAWA ACADEMY
          </div>
          <h4 className="text-academy-dark font-black text-2xl uppercase tracking-tighter">
            LIMBE • CAMEROON
          </h4>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-500 text-xs font-bold tracking-widest mb-6">
            Copyright © 2026, Chawa Basketball Academy. An Elcid & Ida Chawa
            Initiative.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-[10px] font-bold text-gray-400 tracking-widest uppercase">
            <a
              href="#"
              className="hover:text-white underline underline-offset-4"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="hover:text-white underline underline-offset-4"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-white underline underline-offset-4"
            >
              Southwest Federation
            </a>
            <a
              href="#"
              className="hover:text-white underline underline-offset-4"
            >
              Limbe Sports Council
            </a>
          </div>
          <div className="mt-16 flex justify-center items-center gap-3 opacity-20 grayscale">
            <div className="text-white font-black italic text-2xl">
              FECA-BASKET
            </div>
            <div className="w-px h-8 bg-white/50" />
            <div className="text-white font-bold text-xs uppercase tracking-widest">
              Southwest Region
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <FirebaseProvider>
        <AppContent />
      </FirebaseProvider>
    </ErrorBoundary>
  );
}

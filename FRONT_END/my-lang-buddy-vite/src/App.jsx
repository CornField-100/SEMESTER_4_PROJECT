import { useAuth, AuthProvider } from "./context/AuthContext";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import ChatBox from "./components/ChatBox";

function AppContent() {
  const { token, logout } = useAuth();

  if (!token) {
    return (
      <div className="flex gap-8">
        <LoginForm />
        <SignupForm />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Welcome to MyLangBuddy 🎉</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
      <ChatBox />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

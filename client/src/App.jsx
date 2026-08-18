import { BrowserRouter } from "react-router-dom";
import { AuthProvider }  from "./context/AuthContext";
import AppRoutes         from "./app.routes";
import ScrollToTop       from "./components/ui/ScrollToTop";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

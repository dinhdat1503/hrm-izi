import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../features/auth/AuthProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <AuthProvider>{children}</AuthProvider>
    </BrowserRouter>
  );
}

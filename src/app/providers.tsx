import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../features/auth/AuthProvider";
import { ThemeProvider } from "../shared/theme/ThemeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "../../../shared/ui/Input";
import { Button } from "../../../shared/ui/Button";
import { useAuth } from "../hooks/useAuth";

export function LoginPage() {
  const nav = useNavigate();
  const { login, loading, error, isAuthed } = useAuth();

  const [email, setEmail] = useState("demo@gmail.com");
  const [password, setPassword] = useState("123456");

  if (isAuthed) nav("/account");

  const submit = async () => {
    await login(email, password);
    // nếu login ok → isAuthed true → redirect
    nav("/account");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
        <h1 className="text-xl font-semibold">Đăng nhập</h1>
        <p className="text-sm text-gray-500 mt-1">Demo: demo@gmail.com / 123456</p>

        {error && <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <div className="mt-4 space-y-3">
          <div>
            <div className="text-sm font-medium text-gray-700">Email</div>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div>
            <div className="text-sm font-medium text-gray-700">Mật khẩu</div>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <Button onClick={submit} disabled={loading} className="w-full">
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </Button>

          <div className="text-sm text-gray-600 text-center">
            <Link className="underline" to="/forgot-password">Quên mật khẩu?</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

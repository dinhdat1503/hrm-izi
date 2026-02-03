import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Input } from "../../../shared/ui/Input";
import { Button } from "../../../shared/ui/Button";
import { useAuth } from "../useAuth";

export function LoginPage() {
  const { state, login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation() as any;

  const [email, setEmail] = useState("demo@gmail.com");
  const [password, setPassword] = useState("123456");

  useEffect(() => {
    if (state.isAuthed) {
      const to = loc?.state?.from?.pathname || "/admin/users";
      nav(to, { replace: true });
    }
  }, [state.isAuthed, nav, loc]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
        <h1 className="text-xl font-semibold">Đăng nhập</h1>
        <p className="text-sm text-gray-500 mt-1">Demo: demo@gmail.com / 123456</p>

        {state.error && (
          <div className="mt-4 rounded-xl bg-red-50 text-red-700 text-sm p-3">
            {state.error}
          </div>
        )}

        <div className="mt-5 space-y-4">
          <div>
            <div className="text-sm font-medium text-gray-700">Email</div>
            <div className="mt-1">
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-700">Mật khẩu</div>
            <div className="mt-1">
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>

          <Button
            className="w-full"
            disabled={state.loading}
            onClick={() => login(email, password)}
          >
            {state.loading ? "Đang xử lý..." : "Đăng nhập"}
          </Button>

          <div className="text-center text-sm">
            <Link to="/forgot-password" className="text-gray-700 hover:underline">
              Quên mật khẩu?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

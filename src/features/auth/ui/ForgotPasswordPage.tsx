import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "../../../shared/ui/Input";
import { Button } from "../../../shared/ui/Button";
import { useAuth } from "../useAuth";

export function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("demo@gmail.com");
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setOk(null); setErr(null);
    setLoading(true);
    try {
      await forgotPassword(email);
      setOk("Nếu email tồn tại trong hệ thống, hướng dẫn đặt lại mật khẩu đã được gửi (demo).");
    } catch {
      setErr("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
        <h1 className="text-xl font-semibold">Quên mật khẩu</h1>
        <p className="text-sm text-gray-500 mt-1">Nhập email để nhận hướng dẫn</p>

        {ok && <div className="mt-4 rounded-xl bg-green-50 text-green-700 text-sm p-3">{ok}</div>}
        {err && <div className="mt-4 rounded-xl bg-red-50 text-red-700 text-sm p-3">{err}</div>}

        <div className="mt-5 space-y-4">
          <div>
            <div className="text-sm font-medium text-gray-700">Email</div>
            <div className="mt-1">
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          <Button className="w-full" disabled={loading} onClick={submit}>
            {loading ? "Đang gửi..." : "Gửi yêu cầu"}
          </Button>

          <div className="text-center text-sm">
            <Link to="/login" className="text-gray-700 hover:underline">Quay lại đăng nhập</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

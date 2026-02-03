import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "../../../shared/ui/Input";
import { Button } from "../../../shared/ui/Button";
import { useAuth } from "../hooks/useAuth";

export function ForgotPasswordPage() {
  const { forgotPassword, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState<string | null>(null);

  const submit = async () => {
    setOk(null);
    await forgotPassword(email);
    if (!error) setOk("Nếu email tồn tại, hệ thống đã gửi hướng dẫn đặt lại mật khẩu.");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
        <h1 className="text-xl font-semibold">Quên mật khẩu</h1>

        {error && <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        {ok && <div className="mt-4 rounded-xl bg-green-50 p-3 text-sm text-green-700">{ok}</div>}

        <div className="mt-4 space-y-3">
          <div>
            <div className="text-sm font-medium text-gray-700">Email</div>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <Button onClick={submit} disabled={loading} className="w-full">
            {loading ? "Đang gửi..." : "Gửi yêu cầu"}
          </Button>

          <div className="text-sm text-gray-600 text-center">
            <Link className="underline" to="/login">Quay lại đăng nhập</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

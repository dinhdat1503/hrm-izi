export function NotificationsTab({
  notifyEmail,
  onToggle,
}: {
  notifyEmail: boolean;
  onToggle: (v: boolean) => Promise<void>;
}) {
  return (
    <section className="rounded-2xl border border-gray-100 p-5">
      <h2 className="font-semibold">Thông báo</h2>
      <p className="text-sm text-gray-500 mt-1">Tuỳ chỉnh kênh nhận thông báo</p>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-gray-100 p-4">
        <div>
          <div className="text-sm font-medium">Nhận email</div>
          <div className="text-xs text-gray-500">Nhận thông báo qua email khi có cập nhật</div>
        </div>

        <button
          type="button"
          onClick={() => onToggle(!notifyEmail)}
          className={[
            "w-12 h-7 rounded-full p-1 transition",
            notifyEmail ? "bg-gray-900" : "bg-gray-200",
          ].join(" ")}
        >
          <div
            className={[
              "w-5 h-5 rounded-full bg-white transition",
              notifyEmail ? "translate-x-5" : "translate-x-0",
            ].join(" ")}
          />
        </button>
      </div>
    </section>
  );
}

import { useState, useEffect, useCallback } from "rea
import { createRoot } from "react-dom/client";

const API_URL = "https://api.tamironlineesfahan.ir/services";

// ---------- Utilities ----------
const toFarsiDigits = (str) =>
  String(str).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);

const formatPrice = (price) =>
  `${price.toLocaleString("fa-IR")} تومان`;

const validatePhone = (phone) => {
  const cleaned = phone.replace(/[\s\-()]/g, "");
  // الگوی موبایل ایران: 09xxxxxxxxx
  return /^09\d{9}$/.test(cleaned);
};

// ---------- Components ----------
function ServiceCard({ service, onRequest }) {
  const { title, price, isAvailable } = service;
  return (
    <div className={`machine-card ${isAvailable ? "available" : "unavailable"}`}>
      <h3>{title}</h3>
      <p>قیمت: {formatPrice(price)}</p>
      <span className="badge">{isAvailable ? "آماده ارائه" : "غیرفعال"}</span>
      {isAvailable && (
        <button onClick={() => onRequest(service)}>درخواست سرویس</button>
      )}
    </div>
  );
}

function RequestForm({ service, onClose, onSubmit }) {
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null); // {type, message}

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation سمت کلاینت
    const nextErrors = {};
    if (form.name.trim().length < 3) {
      nextErrors.name = "نام باید حداقل ۳ حرف باشد";
    }
    if (!validatePhone(form.phone)) {
      nextErrors.phone = "شماره موبایل معتبر نیست (مثال: 09123456789)";
    }
    if (form.address.trim().length < 10) {
      nextErrors.address = "آدرس را کامل وارد کنید (حداقل ۱۰ حرف)";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    setSubmitResult(null);
    try {
      const res = await fetch(`${API_URL}/${service.id}/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "خطا در ارسال درخواست");
      }
      setSubmitResult({ type: "success", message: "درخواست ثبت شد ✅" });
      // بعد از ۲ ثانیه فرم رو می‌بندیم تا کاربر پیام موفقیت ببینه
      setTimeout(onSubmit, 2000);
    } catch (err) {
      setSubmitResult({ type: "error", message: err.message || "ارسال ناموفق بود" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    // پاک کردن خطای اون فیلد بعد از تایپ
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <h4>درخواست: {service.title}</h4>
      <form onSubmit={handleSubmit} noValidate>
        <input
          placeholder="نام"
          value={form.name}
          onChange={updateField("name")}
          className={errors.name ? "invalid" : ""}
          aria-invalid={!!errors.name}
        />
        {errors.name && <small className="error">{errors.name}</small>}

        <input
          placeholder="شماره موبایل (مثال: 09123456789)"
          value={form.phone}
          onChange={updateField("phone")}
          inputMode="numeric"
          className={errors.phone ? "invalid" : ""}
          aria-invalid={!!errors.phone}
        />
        {errors.phone && <small className="error">{errors.phone}</small>}

        <input
          placeholder="آدرس کامل"
          value={form.address}
          onChange={updateField("address")}
          className={errors.address ? "invalid" : ""}
          aria-invalid={!!errors.address}
        />
        {errors.address && <small className="error">{errors.address}</small>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "در حال ارسال..." : "ثبت درخواست"}
        </button>

        {submitResult && (
          <p className={submitResult.type}>{submitResult.message}</p>
        )}
      </form>
      <button onClick={onClose} disabled={isSubmitting}>بستن</button>
    </div>
  );
}

// ---------- App ----------
function App() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(API_URL, { signal: controller.signal });
        if (!res.ok) throw new Error("عدم دسترسی به سرور");
        const data = await res.json();
        setServices(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  const filtered = useCallback(
    () =>
      services.filter((s) =>
        s.title.toLowerCase().includes(query.trim().toLowerCase())
      ),
    [services, query]
  );

  if (loading) return <p>در حال بارگذاری سرویس‌ها...</p>;
  if (error) return <p>خطا: {error}</p>;

  const result = filtered();

  return (
    <div className="app">
      <h1>سرویس‌های تعمیر آنلاین اصفهان</h1>
      <input
        placeholder="جستجوی سرویس..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="machine-list">
        {result.length === 0 ? (
          <p>سرویسی موجود نیست.</p>
        ) : (
          result.map((s) => (
            <ServiceCard key={s.id} service={s} onRequest={setSelected} />
          ))
        )}
      </div>
      {selected && (
        <RequestForm
          service={selected}
          onClose={() => setSelected(null)}
          onSubmit={() => setSelected(null)}
        />
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);

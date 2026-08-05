import { useState, useEffect }  
import { createRoot } from "react-dom/client";

const API_URL = "https://api.tamironlineesfahan.ir/services"; // بک‌اند FastAPI خودت

function ServiceCard({ service, onRequest }) {
  const { title, price, isAvailable } = service;
  return (
    <div className={`machine-card ${isAvailable ? "available" : "unavailable"}`}>
      <h3>{title}</h3>
      <p>قیمت: {price.toLocaleString("fa-IR")} تومان</p>
      <span className="badge">{isAvailable ? "آماده ارائه" : "غیرفعال"}</span>
      {isAvailable && (
        <button onClick={() => onRequest(service)}>درخواست سرویس</button>
      )}
    </div>
  );
}

function RequestForm({ service, onClose, onSubmit }) {
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | done | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(`${API_URL}/${service.id}/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("خطا در ارسال درخواست");
      setStatus("done");
      onSubmit();
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="modal">
      <h4>درخواست: {service.title}</h4>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="نام"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="شماره تماس"
          required
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          placeholder="آدرس"
          required
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        <button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "در حال ارسال..." : "ثبت درخواست"}
        </button>
        {status === "error" && <p>ارسال ناموفق بود، دوباره تلاش کن.</p>}
        {status === "done" && <p>درخواست ثبت شد ✅</p>}
      </form>
      <button onClick={onClose}>بستن</button>
    </div>
  );
}

function App() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("عدم دسترسی به سرور");
        return res.json();
      })
      .then((data) => setServices(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = services.filter((s) =>
    s.title.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) return <p>در حال بارگذاری سرویس‌ها...</p>;
  if (error) return <p>خطا: {error}</p>;

  return (
    <div className="app">
      <h1>سرویس‌های تعمیر آنلاین اصفهان</h1>
      <input
        placeholder="جستجوی سرویس..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="machine-list">
        {filtered.length === 0 ? (
          <p>سرویسی موجود نیست.</p>
        ) : (
          filtered.map((s) => (
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

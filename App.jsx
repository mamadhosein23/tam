import { useFetchServices } from "./hooks/useFetchServices
import { formatPrice } from "./utils/formatters";
import { RequestForm } from "./components/RequestForm";

const API_URL = "https://api.tamironlineesfahan.ir/services";

export default function App() {
  const { data: services, loading, error } = useFetchServices(API_URL);
  const [query, setQuery] = useState("");
  const [selectedService, setSelectedService] = useState(null);

  // بهینه‌سازی جستجو با useMemo
  const filteredServices = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return services;
    return services.filter((s) => 
      s.title.toLowerCase().includes(search) || 
      (s.description && s.description.toLowerCase().includes(search))
    );
  }, [services, query]);

  if (loading) return <div className="loader">در حال بارگذاری...</div>;
  if (error) return <div className="error-msg">خطا: {error}</div>;

  return (
    <main className="container">
      <header>
        <h1>سرویس‌های تعمیر آنلاین اصفهان</h1>
        <input
          type="search"
          placeholder="جستجوی سرویس (مثلاً: پکیج، کولر...)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
      </header>

      <section className="grid">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              onSelect={() => setSelectedService(service)} 
            />
          ))
        ) : (
          <p>نتیجه‌ای یافت نشد.</p>
        )}
      </section>

      {selectedService && (
        <RequestForm
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </main>
  );
}

function ServiceCard({ service, onSelect }) {
  const { title, price, isAvailable } = service;
  return (
    <article className={`card ${!isAvailable ? "disabled" : ""}`}>
      <h3>{title}</h3>
      <p className="price">{formatPrice(price)}</p>
      <button 
        disabled={!isAvailable} 
        onClick={onSelect}
      >
        {isAvailable ? "درخواست تعمیر" : "بزودی"}
      </button>
    </article>
  );
}

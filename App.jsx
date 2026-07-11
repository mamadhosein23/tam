const machines = [
  { id: 1, title: "تعمیر برد", price: 50000, isAvailable: true },
  { id: 2, title: "تعویض پمپ", price: 300000, isAvailable: false },
  { id: 3, title: "جرم‌گیری", price: 150000, isAvailable: true }
];
function MachineCard ({title,price,isAvailable}){
    return(
        <div>
          <h3>{title}</h3>
      <p>قیمت: {price} ریال</p>
      <p>{isAvailable ? "آماده ارائه" : "غیرفعال"}</p>
    </div>
     ) ;
    }
     function App() {
  return (
    <div>
      <h1>خدمات تعمیرات محمدحسین</h1>
      
      {machines.map((kad) => (
        <MachineCard  
          key={kad.id}
          title={kad.title}
          price={kad.price}
          isAvailable={kad.isAvailable}
        />
      ))
    </div>
  );
     }

    


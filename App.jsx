// data/machine


export const machines = [
  { id: 1, title: "تعمیر برد", price: 50000, isAvailable: true },
  { id: 2, title: "تعویض پمپ", price: 30000, isAvailable: false },
  { id: 3, title: "جرم‌گیری", price: 150000, isAvailable: true },
];
// components/MachineCard.jsx
function MachineCard({ title, price, isAvailable }) {
  return (
    <div>
      <h3>{title}</h3>
      <p>قیمت: {price.toLocaleString()} تومان</p>
      <p>{isAvailable ? "آماده ارائه" : "غیرفعال"}</p>
    </div>
  );
}

export default MachineCard;
// components/MachineList.jsx
import MachineCard from "./MachineCard";

function MachineList({ machines }) {
  return (
    <div>
      {machines.map((machine) => (
        <MachineCard
          key={machine.id}
          title={machine.title}
          price={machine.price}
          isAvailable={machine.isAvailable}
        />
      ))}
    </div>
  );
}

export default MachineList;

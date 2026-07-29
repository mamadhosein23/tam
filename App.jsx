// data/machines.js
export const machines = [
  { id: 1, title: "تعویض شیربرقی", price: 35000, isAvailable: false } ,
  { id: 2, title: "تعویض پمپ", price: 30000, isAvailable: false } ,
  { id: 3, title: "جرم‌گیری", price: 150000, isAvailable: true } ,
];

// components/MachineCard.jsx
import PropTypes from "prop-types";

function MachineCard({ title, price, isAvailable }) {
  return (
    <div className={`machine-card ${isAvailable ? "available" : "unavailable"}`}>
      <h3>{title}</h3>
      <p>قیمت: {price.toLocaleString("fa-IR")} تومان</p>
      <span className="badge">{isAvailable ? "آماده ارائه" : "غیرفعال"}</span>
    </div>
  );
}

MachineCard.propTypes = {
  title: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  isAvailable: PropTypes.bool.isRequired,
};

export default MachineCard;

// components/MachineList.jsx
import PropTypes from "prop-types";
import MachineCard from "./MachineCard";

function MachineList({ machines }) {
  if (!machines?.length) return <p>سرویسی موجود نیست.</p>;

  return (
    <div className="machine-list">
      {machines.map(({ id, ...rest }) => (
        <MachineCard key={id} {...rest} />
      ))}
    </div>
  );
}

MachineList.propTypes = {
  machines: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      isAvailable: PropTypes.bool.isRequired,
    })
  ).isRequired,
};

export default MachineList;

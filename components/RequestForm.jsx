 React, { useState } from "react";
import { validatePhone, validateText } from "../utils/validators";

export function RequestForm({ service, onClose }) {
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateText(form.name) || !validatePhone(form.phone) || !validateText(form.address, 10)) {
      alert("لطفاً اطلاعات را به درستی وارد کنید");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch(`https://api.tamironlineesfahan.ir/services/${service.id}/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setTimeout(onClose, 2000);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" role="dialog">
        <h2>درخواست برای {service.title}</h2>
        {status === "success" ? (
          <p className="success">درخواست با موفقیت ثبت شد!</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <input 
              placeholder="نام و نام خانوادگی" 
              onChange={e => setForm({...form, name: e.target.value})} 
            />
            <input 
              placeholder="شماره تماس (۰۹...)" 
              type="tel"
              onChange={e => setForm({...form, phone: e.target.value})} 
            />
            <textarea 
              placeholder="آدرس دقیق جهت اعزام تعمیرکار" 
              onChange={e => setForm({...form, address: e.target.value})} 
            />
            <div className="actions">
              <button type="submit" disabled={status === "loading"}>
                {status === "loading" ? "در حال ارسال..." : "تایید و ارسال"}
              </button>
              <button type="button" onClick={onClose}>انصراف</button>
            </div>
            {status === "error" && <p className="error">خطا در ارسال! دوباره تلاش کنید.</p>}
          </form>
        )}
      </div>
    </div>
  );
}

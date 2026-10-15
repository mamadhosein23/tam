import React, { useState, useEffect, useRef } from "react";
import { validatePhone, validateText } from "../utils/validators";

export function RequestForm({ service, onClose }) {
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "success" | "error"
  const timerRef = useRef(null);

  // پاکسازی تایمر برای جلوگیری از نشت حافظه
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // پاک کردن خطای فیلد حین تایپ مجدد
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!validateText(form.name)) {
      newErrors.name = "لطفاً نام و نام خانوادگی معتبر وارد کنید.";
    }
    if (!validatePhone(form.phone)) {
      newErrors.phone = "شماره تماس معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹).";
    }
    if (!validateText(form.address, 10)) {
      newErrors.address = "آدرس باید حداقل شامل ۱۰ کاراکتر باشد.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setStatus("loading");
    try {
      const res = await fetch(
        `https://api.tamironlineesfahan.ir/services/${service?.id}/request`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      setStatus("success");
      timerRef.current = setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()} // جلوگیری از بسته‌شدن با کلیک داخل مودال
      >
        <h2 id="modal-title">درخواست برای {service?.title}</h2>

        {status === "success" ? (
          <div className="alert-success" role="status">
            <p>درخواست با موفقیت ثبت شد! در حال بستن پنجره...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="name">نام و نام خانوادگی</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                disabled={status === "loading"}
                placeholder="مثال: علی رضایی"
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">شماره همراه</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                dir="ltr"
                value={form.phone}
                onChange={handleChange}
                disabled={status === "loading"}
                placeholder="0913..."
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="address">آدرس دقیق اعزام تکنسین</label>
              <textarea
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                disabled={status === "loading"}
                placeholder="اصفهان، خیابان..."
                rows={3}
              />
              {errors.address && <span className="error-text">{errors.address}</span>}
            </div>

            {status === "error" && (
              <p className="error-general" role="alert">
                خطا در ثبت درخواست. لطفاً اتصال اینترنت را بررسی کرده و مجدد تلاش کنید.
              </p>
            )}

            <div className="actions">
              <button type="submit" disabled={status === "loading"}>
                {status === "loading" ? "در حال ارسال..." : "تایید و ارسال"}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={onClose}
                disabled={status === "loading"}
              >
                انصراف
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

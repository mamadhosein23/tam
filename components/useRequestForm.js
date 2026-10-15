import { useState, useEffect, useRef, useCallback } from "react";
import { validatePhone, validateText } from "../utils/validators";

// نرمال‌سازی اعداد فارسی/عربی به لاتین
export const toEnDigits = (str = "") =>
  str.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))
     .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));

const INITIAL_STATE = { name: "", phone: "", address: "" };

export function useRequestForm({ serviceId, onSuccessClose }) {
  const [form, setForm] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [serverError, setServerError] = useState("");
  
  const timerRef = useRef(null);
  const abortControllerRef = useRef(null);

  // تمیزکاری حافظه و لغو ریکوئست باز در Unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    const cleanValue = name === "phone" ? toEnDigits(value).trim() : value;

    setForm((prev) => ({ ...prev, [name]: cleanValue }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: null } : prev));
  }, []);

  const validate = () => {
    const currentErrors = {};
    if (!validateText(form.name?.trim())) {
      currentErrors.name = "لطفاً نام و نام خانوادگی معتبر وارد کنید.";
    }
    if (!validatePhone(form.phone)) {
      currentErrors.phone = "شماره همراه معتبر نیست (مثال: 09131234567).";
    }
    if (!validateText(form.address?.trim(), 10)) {
      currentErrors.address = "آدرس باید حداقل شامل ۱۰ کاراکتر باشد.";
    }

    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (status === "loading" || !validate()) return;

    setStatus("loading");
    setServerError("");

    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(
        `https://api.tamironlineesfahan.ir/services/${serviceId}/request`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "خطا در برقراری ارتباط با سرور");
      }

      setStatus("success");
      timerRef.current = setTimeout(() => {
        onSuccessClose();
      }, 2000);
    } catch (err) {
      if (err.name === "AbortError") return;
      setStatus("error");
      setServerError(err.message || "خطایی رخ داده است. لطفاً دوباره تلاش کنید.");
    }
  };

  return { form, errors, status, serverError, handleChange, submit };
}

import React, { useEffect } from "react";
import { useRequestForm } from "./useRequestForm";

export function RequestForm({ service, onClose }) {
  const { form, errors, status, serverError, handleChange, submit } =
    useRequestForm({
      serviceId: service?.id,
      onSuccessClose: onClose,
    });

  // کنترل اسکرول صفحه و بستن با کلید Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && status !== "loading") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, status]);

  return (
    <div
      className="modal-backdrop"
      onClick={status !== "loading" ? onClose : undefined}
      role="presentation"
    >
      <div
        className="modal-box"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <h2 id="dialog-title">درخواست تعمیر: {service?.title}</h2>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            disabled={status === "loading"}
            aria-label="بستن"
          >
            ×
          </button>
        </header>

        {status === "success" ? (
          <div className="status-banner success" role="alert">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p>درخواست با موفقیت ثبت شد. به‌زودی با شما تماس می‌گیریم.</p>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <div className="input-field">
              <label htmlFor="client-name">نام و نام خانوادگی</label>
              <input
                id="client-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                disabled={status === "loading"}
                placeholder="مثال: محمد احمدی"
                autoComplete="name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && <span id="name-error" className="field-error">{errors.name}</span>}
            </div>

            <div className="input-field">
              <label htmlFor="client-phone">شماره همراه جهت هماهنگی</label>
              <input
                id="client-phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                dir="ltr"
                value={form.phone}
                onChange={handleChange}
                disabled={status === "loading"}
                placeholder="0913..."
                autoComplete="tel"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />
              {errors.phone && <span id="phone-error" className="field-error">{errors.phone}</span>}
            </div>

            <div className="input-field">
              <label htmlFor="client-address">آدرس محل دستگاه</label>
              <textarea
                id="client-address"
                name="address"
                value={form.address}
                onChange={handleChange}
                disabled={status === "loading"}
                placeholder="اصفهان، خیابان، کوچه، پلاک..."
                rows={3}
                aria-invalid={!!errors.address}
                aria-describedby={errors.address ? "address-error" : undefined}
              />
              {errors.address && <span id="address-error" className="field-error">{errors.address}</span>}
            </div>

            {status === "error" && (
              <div className="status-banner error" role="alert">
                <span>{serverError}</span>
              </div>
            )}

            <footer className="form-actions">
              <button
                type="submit"
                className="btn-primary"
                disabled={status === "loading"}
              >
                {status === "loading" ? "در حال ثبت اطلاعات..." : "تأیید و اعزام تکنسین"}
              </button>
              <button
                type="button"
                className="btn-outline"
                onClick={onClose}
                disabled={status === "loading"}
              >
                انصراف
              </button>
            </footer>
          </form>
        )}
      </div>
    </div>
  );
}

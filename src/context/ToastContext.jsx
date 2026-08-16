import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const ToastContext = createContext(null)

let idCounter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    (message, opts = {}) => {
      const id = ++idCounter
      const toast = {
        id,
        message,
        type: opts.type || 'info',
        duration: opts.duration ?? 3200,
      }
      setToasts((prev) => [...prev, toast])
      if (toast.duration > 0) {
        window.setTimeout(() => remove(id), toast.duration)
      }
      return id
    },
    [remove],
  )

  const toast = useMemo(
    () => ({
      info: (m, o) => push(m, { ...o, type: 'info' }),
      success: (m, o) => push(m, { ...o, type: 'success' }),
      error: (m, o) => push(m, { ...o, type: 'error' }),
      warning: (m, o) => push(m, { ...o, type: 'warning' }),
    }),
    [push],
  )

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastViewport toasts={toasts} onClose={remove} />
    </ToastContext.Provider>
  )
}

function ToastViewport({ toasts, onClose }) {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-xs flex-col gap-2 sm:bottom-6 sm:right-6">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onClose={onClose} />
      ))}
    </div>
  )
}

const STYLES = {
  info: { ring: 'ring-brand-200', icon: 'text-brand-600', bg: 'bg-brand-50' },
  success: { ring: 'ring-emerald-200', icon: 'text-emerald-600', bg: 'bg-emerald-50' },
  warning: { ring: 'ring-amber-200', icon: 'text-amber-600', bg: 'bg-amber-50' },
  error: { ring: 'ring-red-200', icon: 'text-red-600', bg: 'bg-red-50' },
}

const ICONS = {
  info: '\u24D8',
  success: '\u2713',
  warning: '\u26A0',
  error: '\u2717',
}

function ToastItem({ toast, onClose }) {
  const style = STYLES[toast.type] || STYLES.info
  return (
    <div
      role="status"
      className={`pointer-events-auto flex items-start gap-3 rounded-xl bg-white px-4 py-3 shadow-cardHover ring-1 ${style.ring} animate-toast-in`}
    >
      <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold ${style.bg} ${style.icon}`}>
        {ICONS[toast.type] || ICONS.info}
      </span>
      <p className="flex-1 text-sm font-medium text-ink-800">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="text-ink-400 transition hover:text-ink-700"
        aria-label="Dismiss notification"
      >
        {'\u2715'}
      </button>
    </div>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

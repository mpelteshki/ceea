"use client";

import { useEffect, useRef, useState } from "react";

type ConfirmButtonProps = {
  onConfirm: () => void;
  disabled?: boolean;
  pending?: boolean;
  pendingLabel?: string;
  label?: string;
  confirmLabel?: string;
  className?: string;
};

/**
 * Two-step destructive action button.
 * First click arms the button (turns red, shows confirmLabel).
 * Second click fires onConfirm.
 * Automatically disarms after 3 seconds if not clicked.
 */
export function ConfirmButton({
  onConfirm,
  disabled,
  pending,
  pendingLabel = "Deleting…",
  label = "Delete",
  confirmLabel = "Sure?",
  className = "",
}: ConfirmButtonProps) {
  const [armed, setArmed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isDisabled = disabled || pending;
  // When disabled/pending, treat button as not armed regardless of stored state.
  const isArmed = armed && !isDisabled;

  function disarm() {
    setArmed(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function handleClick() {
    if (isDisabled) return;
    if (!isArmed) {
      setArmed(true);
      timerRef.current = setTimeout(disarm, 3000);
    } else {
      disarm();
      onConfirm();
    }
  }

  // Clean up timer on unmount
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={handleClick}
      onBlur={() => { if (isArmed) disarm(); }}
      aria-live={isArmed ? "assertive" : undefined}
      className={[
        "ui-btn py-1.5 px-3 h-auto text-xs font-bold transition-colors disabled:opacity-50",
        isArmed
          ? "bg-red-600 text-white border-red-600 hover:bg-red-700"
          : "bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white border-red-200 dark:border-red-900",
        className,
      ].join(" ")}
    >
      {pending ? pendingLabel : isArmed ? confirmLabel : label}
    </button>
  );
}

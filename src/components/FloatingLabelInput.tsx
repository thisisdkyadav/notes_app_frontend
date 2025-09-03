import React, { useState } from "react"

interface FloatingLabelInputProps {
  id: string
  name: string
  type: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  required?: boolean
  maxLength?: number
  placeholder?: string
  className?: string
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({ id, name, type, label, value, onChange, disabled = false, required = false, maxLength, placeholder, className = "" }) => {
  const [isFocused, setIsFocused] = useState(false)
  const hasValue = value.length > 0
  const isDateType = type === "date"
  const shouldFloat = isFocused || hasValue

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        placeholder={shouldFloat ? placeholder : ""}
        className={`
          w-full h-[59px] 
          ${isDateType ? "pl-12 pr-4" : "px-4"}
          border-[1.5px] border-[#969696] rounded-[10px]
          bg-white text-[#232323] text-base
          focus:outline-none focus:border-blue-500
          disabled:bg-gray-50 disabled:text-gray-400
          transition-all duration-200 ease-in-out
          ${shouldFloat || isDateType ? "pt-6 pb-2" : "flex items-center"}
          ${isDateType ? "appearance-none" : ""}
          ${className}
        `}
        style={{
          width: "399px",
          maxWidth: "100%",
          lineHeight: shouldFloat ? "normal" : "1",
          color: isDateType && !hasValue && !isFocused ? "transparent" : "#232323",
          ...(isDateType && {
            WebkitAppearance: "none",
            MozAppearance: "textfield",
          }),
        }}
      />
      {isDateType && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer" onClick={() => document.getElementById(id)?.focus()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#969696" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
      )}
      <label
        htmlFor={id}
        className={`
          absolute transition-all duration-200 ease-in-out pointer-events-none
          ${shouldFloat ? "top-0 text-xs text-[#969696] bg-white px-1 left-3 -translate-y-1/2" : `top-1/2 text-base text-[#969696] -translate-y-1/2 ${isDateType ? "left-12" : "left-4"}`}
          ${isFocused ? "text-blue-500" : ""}
        `}
      >
        {label}
      </label>
    </div>
  )
}

export default FloatingLabelInput

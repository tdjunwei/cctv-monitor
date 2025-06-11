'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FieldError } from 'react-hook-form';

// Base form field wrapper
interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: FieldError;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function FormField({ label, htmlFor, error, required, className = "", children }: FormFieldProps) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor} className="mb-2 block">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-sm text-red-600 mt-1">{error.message}</p>
      )}
    </div>
  );
}

// Input field with validation
interface InputFieldProps {
  label: string;
  id: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  error?: FieldError;
  register?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  className?: string;
  // Controlled input props
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: string;
  max?: string;
}

export function InputField({ 
  label, 
  id, 
  placeholder, 
  type = "text", 
  required, 
  error, 
  register, 
  className = "",
  value,
  onChange,
  min,
  max
}: InputFieldProps) {
  const isControlled = value !== undefined && onChange !== undefined;
  
  return (
    <FormField label={label} htmlFor={id} error={error} required={required} className={className}>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        min={min}
        max={max}
        {...(isControlled 
          ? { value, onChange } 
          : (register ? register(id.split('-').pop()) : {})
        )}
      />
    </FormField>
  );
}

// Select field with validation
interface SelectFieldProps {
  label: string;
  id: string;
  placeholder?: string;
  required?: boolean;
  error?: FieldError;
  value?: string;
  onValueChange?: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}

export function SelectField({ 
  label, 
  id, 
  placeholder = "Select an option...", 
  required, 
  error, 
  value,
  onValueChange,
  options,
  className = "" 
}: SelectFieldProps) {
  return (
    <FormField label={label} htmlFor={id} error={error} required={required} className={className}>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );
}

// Checkbox field with validation
interface CheckboxFieldProps {
  label: string;
  id: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  register?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  className?: string;
}

export function CheckboxField({ 
  label, 
  id, 
  checked, 
  onCheckedChange, 
  register,
  className = "" 
}: CheckboxFieldProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        {...(register || {})}
        className="rounded border-gray-300"
      />
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
}

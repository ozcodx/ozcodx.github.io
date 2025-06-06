import { forwardRef } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { es } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import './CyberpunkDatePicker.scss';

// Registrar la localización en español
registerLocale('es', es);

interface CyberpunkDatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  disabled?: boolean;
  placeholder?: string;
  id?: string;
  required?: boolean;
}

// Componente personalizado para el input
const CustomInput = forwardRef<HTMLInputElement, any>(({ value, onClick, onChange, disabled, placeholder, id, required }, ref) => (
  <div className="cyberpunk-date-input-wrapper">
    <input
      ref={ref}
      value={value}
      onClick={onClick}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      id={id}
      required={required}
      readOnly
      className="cyberpunk-date-input"
    />
    <div className="cyberpunk-date-icon" onClick={onClick}>
      <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
      </svg>
    </div>
  </div>
));

CustomInput.displayName = 'CustomInput';

export const CyberpunkDatePicker = ({ 
  selected, 
  onChange, 
  disabled = false, 
  placeholder = "dd/mm/yyyy",
  id,
  required = false
}: CyberpunkDatePickerProps) => {
  
  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="cyberpunk-datepicker">
      <DatePicker
        selected={selected}
        onChange={onChange}
        disabled={disabled}
        dateFormat="dd/MM/yyyy"
        placeholderText={placeholder}
        customInput={<CustomInput id={id} required={required} />}
        showPopperArrow={false}
        popperClassName="cyberpunk-datepicker-popper"
        calendarClassName="cyberpunk-calendar"
        dayClassName={(date) => "cyberpunk-day"}
        weekDayClassName={(date) => "cyberpunk-weekday"}
        monthClassName={(date) => "cyberpunk-month"}
        timeClassName={(date) => "cyberpunk-time"}
        locale="es"
        // Dropdowns deshabilitados para simplificar la interfaz
      />
    </div>
  );
}; 
export interface Feature {
    title: string;
    description: string;
    icon?: string;
}

export interface PageMeta {
    title: string;
    description: string;
    keywords?: string[];
}

export interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    class?: string;
}

export interface FormFieldProps {
    label: string;
    name: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'datetime-local' | 'month' | 'week' | 'color' | 'file';
    required?: boolean;
    placeholder?: string;
    error?: string;
    value?: string;
    disabled?: boolean;
    className?: string;
    helperText?: string;
    icon?: string | null;
    iconPosition?: 'left' | 'right';
    autocomplete?: 'on' | 'off' | 'name' | 'email' | 'username' | 'current-password' | 'new-password' | 'one-time-code' | 'organization-title' | 'organization' | 'street-address' | 'country' | 'country-name' | 'postal-code' | 'cc-name' | 'cc-number' | 'cc-exp' | 'cc-exp-month' | 'cc-exp-year' | 'cc-csc' | 'cc-type' | 'transaction-currency' | 'transaction-amount' | 'language' | 'bday' | 'bday-day' | 'bday-month' | 'bday-year' | 'sex' | 'tel' | 'tel-country-code' | 'tel-area-code' | 'tel-local' | 'tel-local-prefix' | 'tel-local-suffix' | 'tel-extension' | 'url' | 'photo' | null;
    id?: string;
    validateOnBlur?: boolean;
    validateOnInput?: boolean;
}

export interface FormGroupProps {
    legend: string;
    description?: string | null;
    error?: string | null;
    className?: string;
}

export interface FormContainerProps {
    onSubmit: (event: SubmitEvent) => void;
    className?: string;
    novalidate?: boolean;
}

export interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: string;
    class?: string;
}

export interface ErrorBoundaryProps {
    fallback?: string;
    onError?: (error: Error) => void;
} 
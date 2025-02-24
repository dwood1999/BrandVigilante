export interface FormErrors {
    email?: string;
    phone?: string;
    password?: string;
}

export interface ActionData {
    success: boolean;
    message: string;
    fieldErrors?: FormErrors;
    data?: {
        email?: string;
        phone?: string;
    };
} 
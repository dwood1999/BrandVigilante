export interface FormErrors {
    email?: string;
    password?: string;
}

export interface ActionData {
    success: boolean;
    message: string;
    fieldErrors?: FormErrors;
    data?: {
        email?: string;
    };
} 
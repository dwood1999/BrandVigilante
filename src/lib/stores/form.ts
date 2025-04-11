import { writable, type Writable } from 'svelte/store';
import { z } from 'zod';

export interface FormState<T> {
    values: T;
    errors: Partial<Record<keyof T, string>>;
    touched: Partial<Record<keyof T, boolean>>;
    isSubmitting: boolean;
    isValid: boolean;
}

export function createFormStore<T extends z.ZodType>(schema: T) {
    const initialState: FormState<z.infer<T>> = {
        values: {} as z.infer<T>,
        errors: {},
        touched: {},
        isSubmitting: false,
        isValid: false
    };

    const { subscribe, set, update }: Writable<FormState<z.infer<T>>> = writable(initialState);

    return {
        subscribe,
        setField: (field: keyof z.infer<T>, value: any) => {
            update(state => ({
                ...state,
                values: { ...state.values, [field]: value },
                touched: { ...state.touched, [field]: true }
            }));
        },
        setFields: (values: Partial<z.infer<T>>) => {
            update(state => ({
                ...state,
                values: { ...state.values, ...values }
            }));
        },
        validate: () => {
            update(state => {
                try {
                    schema.parse(state.values);
                    return {
                        ...state,
                        errors: {},
                        isValid: true
                    };
                } catch (error) {
                    if (error instanceof z.ZodError) {
                        const errors: Partial<Record<keyof z.infer<T>, string>> = {};
                        error.errors.forEach(err => {
                            if (err.path) {
                                errors[err.path[0] as keyof z.infer<T>] = err.message;
                            }
                        });
                        return {
                            ...state,
                            errors,
                            isValid: false
                        };
                    }
                    return state;
                }
            });
        },
        reset: () => {
            set(initialState);
        },
        setSubmitting: (isSubmitting: boolean) => {
            update(state => ({ ...state, isSubmitting }));
        }
    };
} 
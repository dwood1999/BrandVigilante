import { writable } from "svelte/store";

export const ButtonGroupContext = Symbol("ButtonGroupContext");

export type ButtonGroupOrientation = "horizontal" | "vertical";

export interface ButtonGroupContextType {
    orientation: ButtonGroupOrientation;
}

export const createButtonGroupContext = (orientation: ButtonGroupOrientation = "horizontal") => {
    return writable<ButtonGroupContextType>({ orientation });
}; 
import type {ConstraintViolation} from "~/dto/ConstraintViolation";
import type {ReactElement} from "react";

export function useConstraintViolations() {

    const hasError = (field: string, violations: ConstraintViolation[]): boolean => {
        return getMessages(field, violations).length > 0;
    }

    const getMessages = (field: string, violations: ConstraintViolation[]): string[] => {
        return violations.find(value => value.field === field)?.messages ?? [];
    }

    const getMessageElements = (field: string, violations: ConstraintViolation[]): ReactElement[] => {
        return violations.find(value => value.field === field)?.messages.map( message => {
            return <p> {message} </p>;
        }
        ) ?? [];
    }

    const removeFieldError = (field: string, violations: ConstraintViolation[]): ConstraintViolation[] => {
       return violations.filter(element => element.field !== field);
    }

    return { hasError, getMessages, removeFieldError, getMessageElements };
}

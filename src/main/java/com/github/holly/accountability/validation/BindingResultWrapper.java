package com.github.holly.accountability.validation;

import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.groupingBy;
import static org.springframework.util.StringUtils.hasText;


public class BindingResultWrapper {

    private final List<BindingResultError> violations;

    public BindingResultWrapper(BindingResult bindingResult) {
        this.violations = bindingResult.getFieldErrors().stream()
                .collect(groupingBy(FieldError::getField))
                .entrySet().stream()
                .map(BindingResultWrapper::getBindingResultError)
                .toList();
    }

    private static BindingResultError getBindingResultError(Map.Entry<String, List<FieldError>> entry) {
        return new BindingResultError(
                entry.getKey(),
                entry.getValue().stream().map(BindingResultWrapper::extractMessageString).toList()
        );
    }

    private static String extractMessageString(FieldError fieldError) {
        if (hasText(fieldError.getDefaultMessage())) {
            return fieldError.getDefaultMessage();
        }
        return fieldError.getCode();
    }

    public List<BindingResultError> getViolations() {
        return violations;
    }
}

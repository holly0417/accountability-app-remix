package com.github.holly.accountability.validation;
import org.springframework.validation.BindingResult;

import java.util.Arrays;
import java.util.List;


public class BindingResultWrapper {
    private List<BindingResultError> violations;

    public BindingResultWrapper(BindingResult bindingResult) {
       this.violations = bindingResult.getFieldErrors().stream().map( res -> {
           if(res.getCodes() == null){
             return new BindingResultError(res.getField(), List.of());
           }
           return new BindingResultError(res.getField(), Arrays.asList(res.getCodes()));
       }).toList();
    }

    public List<BindingResultError> getViolations() {
        return violations;
    }
}

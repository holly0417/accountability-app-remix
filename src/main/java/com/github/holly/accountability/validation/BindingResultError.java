package com.github.holly.accountability.validation;

import java.util.List;

public record BindingResultError(String field, List<String> messages) {
}

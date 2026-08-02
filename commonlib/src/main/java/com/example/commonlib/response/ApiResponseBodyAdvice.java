package com.example.commonlib.response;

import org.springframework.core.MethodParameter;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

@RestControllerAdvice
public class ApiResponseBodyAdvice implements ResponseBodyAdvice<Object> {

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        return true;
    }

    @Override
    public Object beforeBodyWrite(
            Object body,
            MethodParameter returnType,
            MediaType selectedContentType,
            Class<? extends HttpMessageConverter<?>> selectedConverterType,
            ServerHttpRequest request,
            ServerHttpResponse response
    ) {
        if (body instanceof ApiResponse<?>) {
            return body;
        }
        if (!MediaType.APPLICATION_JSON.includes(selectedContentType)) {
            return body;
        }

        int status = HttpStatus.OK.value();
        String title = HttpStatus.OK.getReasonPhrase();

        if (response instanceof ServletServerHttpResponse servletResponse) {
            status = servletResponse.getServletResponse().getStatus();
            HttpStatus httpStatus = HttpStatus.resolve(status);
            title = httpStatus != null ? httpStatus.getReasonPhrase() : "HTTP " + status;
        }

        return ApiResponse.builder()
                .status(status)
                .title(title)
                .message(status >= 200 && status < 300 ? "Success" : title)
                .data(body)
                .build();
    }
}

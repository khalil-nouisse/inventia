package com.ensam.inventia.exception;
import com.ensam.inventia.dto.response.ApiResponse; import org.springframework.http.*; import org.springframework.web.bind.MethodArgumentNotValidException; import org.springframework.web.bind.annotation.*;
@RestControllerAdvice
public class GlobalExceptionHandler {
 @ExceptionHandler(ResourceNotFoundException.class) @ResponseStatus(HttpStatus.NOT_FOUND) ApiResponse<Void> notFound(RuntimeException e){return ApiResponse.fail(e.getMessage(),404);}
 @ExceptionHandler({BadRequestException.class,DuplicateResourceException.class,TeamFullException.class,DeadlinePassedException.class,DuplicateSubmissionException.class,DuplicateScoreException.class}) @ResponseStatus(HttpStatus.BAD_REQUEST) ApiResponse<Void> bad(RuntimeException e){return ApiResponse.fail(e.getMessage(),400);}
 @ExceptionHandler(UnauthorizedOperationException.class) @ResponseStatus(HttpStatus.FORBIDDEN) ApiResponse<Void> forbidden(RuntimeException e){return ApiResponse.fail(e.getMessage(),403);}
 @ExceptionHandler(MethodArgumentNotValidException.class) @ResponseStatus(HttpStatus.BAD_REQUEST) ApiResponse<Void> validation(MethodArgumentNotValidException e){return ApiResponse.fail("Validation failed",400);}
}

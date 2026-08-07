import { ExceptionFilter,Catch,ArgumentsHost,HttpException,HttpStatus } from "@nestjs/common";
import {Response} from "express";
import { ApiResponse } from "../response/api-response";


interface HttpExceptionResponse {
  message: string | string[];
  error?: string;
  statusCode?: number;
}


@Catch()
export class HttpExceptionFilter implements ExceptionFilter{
    catch(exception:unknown,host:ArgumentsHost){
        const ctx=host.switchToHttp();
        const response=ctx.getResponse<Response>()
        let status=HttpStatus.INTERNAL_SERVER_ERROR;
        let message="Internal Server Error";
                if(exception instanceof HttpException){
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse() as HttpExceptionResponse;
            
            let extractedMessage = exceptionResponse.message || exception.message;
            
            if (Array.isArray(extractedMessage)) {
                extractedMessage = extractedMessage[0];
            }
            message = String(extractedMessage); 
        }

        response.status(status).json(ApiResponse.error(message,status));
    }
}
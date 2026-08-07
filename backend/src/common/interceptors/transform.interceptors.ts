import { Injectable , NestInterceptor,ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApiResponse } from "../response/api-response";

export interface Response<T>{
    data:T,
    message?:string;
}

@Injectable()
export class TransformInterceptors<T> implements NestInterceptor<T, ApiResponse<T>>{
    intercept(context:ExecutionContext,next:CallHandler):Observable <ApiResponse<T>>{
        return next.handle().pipe(
            map(res=>{
                if(res instanceof ApiResponse){
                    return res;
                }
                const data=res?.data !== undefined? res.data:res;
                const message=res?.message ||"Success";
                const statusCode=context.switchToHttp().getResponse().statusCode;
                return ApiResponse.ok(data,message,statusCode);
            })
        )
    }
}
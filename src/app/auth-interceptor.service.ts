import {
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';

import { tap } from 'rxjs/operators';

export class AuthInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // pode colocar um IF aqui para checar algo do req e determinar qual ação tomar.
    console.log('Request is on its way:', req.method);
    console.log(req.url);

    const modifiedRequest = req.clone({
      headers: req.headers.append('Auth', 'myauth'),
    });
    //return next.handle(req);
    /*return next.handle(modifiedRequest).pipe(
      tap((event) => {
        if (event.type === HttpEventType.Response) {
          console.log('Response Received, body data:\n', event.body);
        }
      })
    );

    SUBSTITUIDO PELO SERVICO LOGGING-INTERCEPTRO.SERVICE
    */
    return next.handle(modifiedRequest);
  }
}

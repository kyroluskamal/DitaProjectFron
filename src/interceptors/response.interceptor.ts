import { HttpInterceptorFn } from '@angular/common/http';

export const ResponseInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};

import { Application, Router } from 'express';
import userRoutes from './user-routes';

const _routes: [string, Router][] = [['/api/users', userRoutes]];

export const routes = (app: Application): void => {
    _routes.forEach((route) => {
        const [url, handler] = route;
        app.use(url, handler);
    });
};

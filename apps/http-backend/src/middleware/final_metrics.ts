import {Request,Response,NextFunction } from 'express';
import {requestcounter} from '../metrics/requestCount'
import { activeRequest } from '../metrics/activeRequest';
import { responseTime } from '../metrics/responseTime';
export default function metrics(req:Request,res:Response,next:NextFunction){
    const startTime = Date.now();
    activeRequest.inc()
    res.on('finish', () => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        requestcounter.inc({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            status_code: res.statusCode
        });
        responseTime.observe({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            status_code: res.statusCode
        },duration)
        activeRequest.dec()
    });

    next();
}
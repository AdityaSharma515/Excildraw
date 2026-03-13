import client from 'prom-client'

export const requestcounter=new client.Counter({
        name:"http_request_total",
        help:"Total number HTTP request",
        labelNames:['method','route','status_code']
}) ;
import client from 'prom-client'

export const activeRequest=new client.Gauge({
        name:"http_request_active",
        help:"Total active HTTP request",
}) ;
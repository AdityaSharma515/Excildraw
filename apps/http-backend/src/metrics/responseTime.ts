import client from 'prom-client'

export const responseTime=new client.Histogram({
        name:"http_request_duration",
        help:"Duration of HTTP request",
        labelNames:['method','route','status_code'],
        buckets:[0.1, 5, 15, 50, 100, 300, 500, 1000, 3000, 5000]
}) ;
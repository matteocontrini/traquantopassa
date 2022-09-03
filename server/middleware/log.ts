import { defineEventHandler } from 'h3';

export default defineEventHandler((event) => {
    const ip = event.req.headers['fly-client-ip'] || event.req.socket.remoteAddress;
    console.log(`${ip} - GET ${event.req.url}`);
});

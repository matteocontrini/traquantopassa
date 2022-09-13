import { defineEventHandler } from 'h3';
import { loadRoutes } from '~/server/routes';

loadRoutes();

export default defineEventHandler((event) => {});

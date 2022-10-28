import { defineEventHandler } from 'h3';
import * as routes from '~/server/routes';

routes.load();

export default defineEventHandler((event) => {});

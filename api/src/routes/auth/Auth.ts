import { Router } from 'express';
import siteAuth from './SiteAuth';

const auth = Router();

auth.use('/', siteAuth);

export default auth;

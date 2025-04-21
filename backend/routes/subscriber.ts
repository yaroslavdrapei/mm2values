import { Router } from 'express';
import { delSubscriber, getAllSubscribers, getSubscriber, postSubscriber } from '../controllers/subscriber';

const subscriberRouter = Router();

subscriberRouter.get('/', getAllSubscribers);
subscriberRouter.get('/:chatId', getSubscriber);
subscriberRouter.post('/', postSubscriber);
subscriberRouter.delete('/:chatId', delSubscriber);

export { subscriberRouter };

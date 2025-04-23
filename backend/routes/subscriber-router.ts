import { Router } from 'express';
import { SubscriberController } from '../controllers/subscriber-controller';

const subscriberController = new SubscriberController();
const subscriberRouter = Router();

subscriberRouter.get('/', subscriberController.getAllSubscribers);
subscriberRouter.get('/:chatId', subscriberController.getSubscriber);
subscriberRouter.post('/', subscriberController.createSubscriber);
subscriberRouter.delete('/:chatId', subscriberController.deleleSubscriber);

export { subscriberRouter };

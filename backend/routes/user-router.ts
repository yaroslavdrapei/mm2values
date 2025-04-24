import { Router } from 'express';
import { UserController } from '../controllers/user-controller';

const userController = new UserController();
const userRouter = Router();

userRouter.get('/', userController.getAllUsers);
userRouter.get('/:chatId', userController.getUser);
userRouter.post('/', userController.createUser);
userRouter.delete('/:chatId', userController.deleleUser);
userRouter.patch('/:chatId', userController.patchUser);

export { userRouter };

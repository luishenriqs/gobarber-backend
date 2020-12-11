import { Request, Response } from 'express';
import UpdateUserAvatarService from '@modules/users/services/UpdatUserAvatarService';
import { container } from 'tsyringe';

export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    /* O 'container.resolve' injeta uma instância uma classe do service
    "UpdateUserAvatarService" dentro da rota;  */
    const updateUserAvatar = container.resolve(UpdateUserAvatarService);
    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatarFileName: request.file.filename,
    });
    delete user.password;

    return response.json({ user });
  }
}

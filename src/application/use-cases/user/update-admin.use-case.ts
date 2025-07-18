import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { UpdateAdminDto } from "src/application/dtos/auth/update-admin.dto";
import { MailService } from "src/application/services/mail.service";
import { User } from "src/domain/entities/user.entity";
import { PERMISSION_REPOSITORY, PermissionRepositoryInterface } from "src/domain/repositories/permission.repository";
import { USER_REPOSITORY, UserRepositoryInterface } from "src/domain/repositories/user.repository";
import { errorResponse } from "src/shared/helpers/response.helper";

@Injectable()
export class UpdateAdminUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepo: UserRepositoryInterface,
        @Inject(PERMISSION_REPOSITORY)
        private readonly permissionRepo: PermissionRepositoryInterface,
        private readonly mailService: MailService
    ){}

    async execute(userId: number,data: UpdateAdminDto){
        const user = await this.userRepo.findById(userId);
        if(!user){
            throw new NotFoundException(
                errorResponse('المستخدم غير موجود',404)
            );
        }

        const existing = await this.userRepo.findByEmailOrPhone(data.email,data.phone);
        if(existing && existing.id !== user.id){
            throw new BadRequestException(
                errorResponse('البريد الإلكتروني أو رقم الهاتف مستخدم مسبقًا.',400)
            );
        }

        const updateData: Partial<User> = {
          first_name: data.first_name ?? user.first_name,
          last_name: data.last_name ?? user.last_name,
          email: data.email ?? user.email,
          phone: data.phone ?? user.phone,
        };

        if (data.first_name || data.last_name) {
          const baseUsername = `${updateData.first_name} ${updateData.last_name}`;
          updateData.username = `${baseUsername}-${user.id}`;
        }

        await this.userRepo.update(userId,updateData);

        if(data.permissionIds?.length){
            const permissions = await this.permissionRepo.findByIds(data.permissionIds);
            await this.permissionRepo.updateUserPermissions(userId,permissions);            
        }


        //if i want to send for email when update admin information
        
        // const email = data.email ?? user.email;
        // const username = updateData.username ?? user.username;

        // await this.mailService.sendAdminCredentials(email,username,'كلمة المرور الخاصة بك لم تتغير');
    }
}
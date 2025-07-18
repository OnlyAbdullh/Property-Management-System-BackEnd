
import { InjectQueue } from '@nestjs/bull';
import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  BadRequestException,
  Put,
  Param,
} from '@nestjs/common';
import { Queue } from 'bull';
import { privateDecrypt } from 'crypto';
import { identity } from 'rxjs';
import { SendNotificationDto } from 'src/application/dtos/notification/send-notification.dto';
import { FirebaseService } from 'src/application/services/firebase.service';
import { CreateNotificationUseCase } from 'src/application/use-cases/notification/create-notification.use-case';
import { ListNotificationsUseCase } from 'src/application/use-cases/notification/list-notifications.use-case';
import { MarkNotificationReadUseCase } from 'src/application/use-cases/notification/mark-notification-read.use-case';
import { NotificationQueueService } from 'src/infrastructure/queues/notificatoin-queue.service';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { successPaginatedResponse, successResponse } from 'src/shared/helpers/response.helper';

@Controller('notifications')
@UseInterceptors(ClassSerializerInterceptor)
export class NotificationsController {
  constructor(
    // private readonly 
    private readonly createNotificationUseCase: CreateNotificationUseCase,
    private readonly listNotificationsUseCase: ListNotificationsUseCase,
    private readonly markReadUseCase: MarkNotificationReadUseCase,    
    private readonly firebaseService: FirebaseService,
    private readonly notificationQueue: NotificationQueueService,
  ) {}

  @Get()
  async getUserNotifications(
    @CurrentUser() user,
  ){
    const userId = user.sub;
    const notifications = await this.listNotificationsUseCase.execute(userId);

    return successResponse(notifications,'تم ارجاع جميع الاشعارات الخاصة بك ',200);
  }
  @Post('device')
  @HttpCode(HttpStatus.OK)
  async sendToDevice(@Body() dto: {
  token: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}) {
    const { token, title, body, data } = dto;
    
    this.notificationQueue.sendToDevice(token, title, body, data);

    return { message: 'Notification queued successfully 🚀' };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createNotification(
    @CurrentUser() user,
    @Body() body: SendNotificationDto,
  ) {
    const userId = user.sub;
    const { title, body: notificationBody, data} = body;

    const notification = await this.createNotificationUseCase.execute(
      userId,
      title,
      notificationBody,
      data,
    );

    return successResponse(notification, 'تم إنشاء الإشعار وإرساله', 201);
  }

  @Put(':id/read')
  async markAsRead(
    @Param('id') id: number,
  ){
    await this.markReadUseCase.execute(id);

    return successResponse([],'تم تحديث حالة الإشعار على أنه مقروء',200);
  }
}

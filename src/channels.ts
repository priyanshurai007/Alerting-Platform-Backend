import { DeliveryType, NotificationDelivery } from './models';
import dayjs from 'dayjs';
import { v4 as uuid } from 'uuid';
import { db } from './store';

export interface NotificationChannel {
  type: DeliveryType;
  send(toUserId: string, alertId: string): NotificationDelivery;
}

export class InAppChannel implements NotificationChannel {
  type: DeliveryType = 'InApp';

  send(toUserId: string, alertId: string): NotificationDelivery {
    const delivery: NotificationDelivery = {
      id: uuid(),
      alertId,
      userId: toUserId,
      channel: this.type,
      deliveredAt: dayjs().toISOString()
    };
    db.deliveries.push(delivery);
    return delivery;
  }
}

// Future: EmailChannel, SmsChannel implementing NotificationChannel.

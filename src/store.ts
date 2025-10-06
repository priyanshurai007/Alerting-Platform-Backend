import { Alert, NotificationDelivery, Team, User, UserAlertState } from './models';

export const db = {
  alerts: [] as Alert[],
  users: [] as User[],
  teams: [] as Team[],
  deliveries: [] as NotificationDelivery[],
  userAlertStates: [] as UserAlertState[]
};

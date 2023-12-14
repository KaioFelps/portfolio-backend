import { Log } from '../entities/log';

export abstract class ILogsRepository {
  abstract create(log: Log): Promise<void>;
}

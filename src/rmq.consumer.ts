import { EServiceType } from './common/enums/system/service-type.enum';
import { configService } from './config/config.service';

export const rmqConsumerSetting = (appConfigs: any) => {
  let queueConfigs = null;
  switch (appConfigs.get('SERVICE_TYPE')) {
    case EServiceType.MAIN_SERVICE:
      queueConfigs = [
        {
          queueName: 'TEST_QUEUE',
          prefetchCount: 10
        }
      ];
      break;
  }

  return queueConfigs;
};

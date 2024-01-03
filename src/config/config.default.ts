import { MidwayConfig } from '@midwayjs/core';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1704158706146_7834',
  koa: {
    port: 7001,
  },
  typeorm: {
    dataSource: {
      default: {
        /**
         * 单数据库实例
         */
        type: 'mysql',
        host: '192.168.0.220',
        port: 3306,
        username: 'root',
        password: '123456',
        database: 'mocker',
        synchronize: false,     // 如果第一次使用，不存在表，有同步的需求可以写 true，注意会丢数据
        logging: true,
        entities: [
          '**/entity/*.entity{.ts,.js}'
        ]
      }
    }
  },
} as MidwayConfig;

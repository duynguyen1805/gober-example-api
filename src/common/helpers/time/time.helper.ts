import { Constants } from '../../../constants';

export class TimeHelper {
  public static before(
    periodInMilis: number,
    from: Date | number = new Date()
  ) {
    return new Date(new Date(from).getTime() - periodInMilis);
  }

  public static after(periodInMilis: number, from: Date | number = new Date()) {
    return new Date(new Date(from).getTime() + periodInMilis);
  }

  public static getDate(dateInMillisecond: number) {
    const startOfDate =
      Math.floor(dateInMillisecond / Constants.ONE_DAY_IN_MILLISECOND) *
      Constants.ONE_DAY_IN_MILLISECOND;
    const endOfDate =
      Math.ceil(dateInMillisecond / Constants.ONE_DAY_IN_MILLISECOND) *
      Constants.ONE_DAY_IN_MILLISECOND;
    return {
      startAt: new Date(startOfDate),
      endAt: new Date(endOfDate)
    };
  }

  public static getMonth(
    year: number,
    month: number
  ): { startAt: Date; endAt: Date } {
    // month: 0 - 11
    return {
      startAt: new Date(`${year}-${month + 1}-1 GMT+0`),
      endAt: new Date(`${year}-${month + 2}-1 GMT+0`)
    };
  }

  public static greaterThan(
    a: number | string | Date,
    b: number | string | Date
  ) {
    return new Date(a).getTime() > new Date(b).getTime();
  }

  public static smallerThan(
    a: number | string | Date,
    b: number | string | Date
  ) {
    return new Date(a).getTime() < new Date(b).getTime();
  }

  public static wait(millisecond: number) {
    return new Promise((resolve) => setTimeout(resolve, millisecond));
  }

  public static now() {
    return Date.now();
  }
}

export interface IPaymentPeriod {
  startAt: number;
  isSunday: boolean;
}

export function extractMonthYear(date: Date | string) {
  const d = new Date(date);
  return {
    month: d.getMonth() + 1, // getMonth() trả về 0-11
    year: d.getFullYear()
  };
}

export function isExpired(created: string | Date, expiredTime: number) {
  const getTimeByString = (str: string) => new Date(`${str} GMT+0`).getTime();
  const time =
    typeof created === 'string' ? getTimeByString(created) : created.getTime();
  return time + expiredTime < TimeHelper.now();
};

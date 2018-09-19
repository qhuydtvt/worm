import time
import datetime


def cal_teacher_time(data, num_day):
  if num_day == 0:
    num_day = 1
  log = []
  time_list = []
  total = 0
  for key, value in data.items():
      for val in value:
          t = time.strptime(val['time'].split(',')[0], '%H:%M:%S')
          _time = datetime.timedelta(hours=t.tm_hour, minutes=t.tm_min, seconds=t.tm_sec).total_seconds()
          time_list.append(_time)
      total = sum(time_list)
      time_list = []
      log.append({"techer": key, "time": str(datetime.timedelta(seconds=total / num_day))})
  return log


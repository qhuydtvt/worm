import time
import datetime
from services import lms


def cal_teacher_time(data, num_day):
  if num_day == 0:
    num_day = 1
  log = {}
  time_list = []
  total = 0
  for key, value in data.items():
      for val in value:
          t = time.strptime(val['time'].split(',')[0], '%H:%M:%S')
# convert str timre to second
          _time = datetime.timedelta(hours=t.tm_hour,
                                     minutes=t.tm_min,
                                     seconds=t.tm_sec).total_seconds()
          time_list.append(_time)
      total = sum(time_list)
      time_list = []
      avg_time = total / num_day
      log[key] = [str(datetime.timedelta(seconds=total)), str(datetime.timedelta(seconds=avg_time))]
  return log


def get_classroom_lms():
  r = lms.classroom.get()
  data = r.json()
  return data


classroom_info = get_classroom_lms()


def cal_classroom_time(data, num_day):
    if num_day == 0:
        num_day = 1
    log = {}
    time_list = []
    total = 0
    for key, value in data.items():
        for val in value:
            t = time.strptime(val['time'].split(',')[0], '%H:%M:%S')
    # convert str timre to second
            _time = datetime.timedelta(hours=t.tm_hour,
                                       minutes=t.tm_min,
                                       seconds=t.tm_sec).total_seconds()
            time_list.append(_time)
        total = sum(time_list)
        time_list = []
        for classroom in classroom_info['data']:
            if classroom["_id"] == key:
                avg_time = total / num_day / len(classroom["members"])
                log[key] = [str(datetime.timedelta(seconds=total)), str(datetime.timedelta(seconds=avg_time))]
    return log

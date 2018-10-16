import time
import datetime
from services import lms
from django.core.cache import cache


def cal_time(value):
    time_list = []
    for val in value:
          t = time.strptime(val['time'].split(',')[0], '%H:%M:%S')
# convert str time to second
          _time = datetime.timedelta(hours=t.tm_hour,
                                     minutes=t.tm_min,
                                     seconds=t.tm_sec).total_seconds()
          time_list.append(_time)
    return time_list


def cal_teacher_time(data, num_day):
  if num_day == 0:
    num_day = 1
  log = {}
  total = 0
  for key, value in data.items():
    time_list = cal_time(value)
    total = sum(time_list)
    time_list = []
    avg_time = total / num_day
    log[key] = [str(datetime.timedelta(seconds=total)), str(datetime.timedelta(seconds=avg_time))]
  return log


def get_classroom_lms():
  TOKEN = cache.get('access_token')
  lms.classroom.url += "?listAll=1&access_token=" + TOKEN
  r = lms.classroom.get()
  data = r.json()
  lms.classroom.url = lms.reset_url_classroom
  return data


def cal_classroom_time(data, num_day):
  classroom_info = get_classroom_lms()
  if num_day == 0:
      num_day = 1
  log = {}
  total = 0
  for key, value in data.items():
      time_list = cal_time(value)
      total = sum(time_list)
      time_list = []
      for classroom in classroom_info['data']['class']:
          if classroom["_id"] == key:
              avg_time = total / num_day / len(classroom["members"])
              log[key] = [str(datetime.timedelta(seconds=total)), str(datetime.timedelta(seconds=avg_time))]
  return log

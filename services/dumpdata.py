if __name__ == "__main__":

  import json
  import requests
  with open("worm.json") as worm:
    data = json.load(worm)

  att_data = data[0]
  grade_data = data[1]

  api = requests.get("http://learn.techkids.vn/worm/api/grades?classroom_id=5bcc4a34639b2ecee1b84d9a")
  print(api.json())

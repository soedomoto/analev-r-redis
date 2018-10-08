import json
import threading
import urllib.parse
from datetime import datetime
from uuid import uuid4
import requests
import config


with open('{}.csv'.format(__file__), 'w+') as f:
    f.write('')

ss = {}

class myThread (threading.Thread):
    def __init__(self, i):
        threading.Thread.__init__(self)
        self.i = i
        self.start()

    def run(self):
        global ss

        ss.setdefault(self.i, {})
        ss[self.i]['start'] = datetime.now()

        session_id = self.i
        request_id = str(uuid4())
        req = {
           'sess': session_id, 'id': request_id, 'func': 'data.get_catalogues', 'args': []
        }
        resp = None

        r_req = requests.post(config.webdis_url,
                             data='LPUSH/req/{}'.format(urllib.parse.quote_plus(json.dumps(req))))
        for op, val in r_req.json().items():
           if op == 'LPUSH' and val >= 1:
               r_resp = requests.post(config.webdis_url,
                                      data='BRPOP/resp-{}/timeout/3600'.format(request_id))

               for op, val in r_resp.json().items():
                   if op == 'BRPOP' and val != None:
                       key, resp = val
                       resp = json.loads(resp)

        ss[self.i]['stop'] = datetime.now()
        ms = (ss[self.i]['stop'] - ss[self.i]['start']).microseconds / 1000

        all_times.append(ms)
        print('{}. Time: {}, Result: {}'.format(self.i, ms, resp))

        with open('{}.csv'.format(__file__), 'a+') as f:
            f.write('{}\n'.format(ms))


all_times = []
threads = []
for i in config.sessions:
    t = myThread(i)
    threads.append(t)

for t in threads:
    t.join()

print('')
print('Averange: {}'.format(sum(all_times) / len(all_times)))
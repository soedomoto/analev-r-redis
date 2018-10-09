import json
import threading
import urllib.parse
import time
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
        self.session_id = config.sessions[self.i]
        self.request_id = str(uuid4())

        self.start()

    def send_request(self):
        req = {
            'sess': self.session_id, 'id': self.request_id, 'func': 'module.file.name.eval',
            'args': ["summary", {
                "dataset": "df{}".format(self.i),
                "dataset_name": "diamonds.csv",
                "r_var": "price",
                "e_vars": "carat:clarity"
            }]
        }
        r_req = requests.post(config.webdis_url,
                              data='LPUSH/req/{}'.format(urllib.parse.quote_plus(json.dumps(req))))

        for op, val in r_req.json().items():
            if op == 'LPUSH' and val >= 1:
                return True

        return False

    def get_response(self):
        r_resp = requests.post(config.webdis_url,
                               data='BRPOP/resp-{}/timeout/10'.format(self.request_id))
        if r_resp.status_code == 200:
            for op, val in r_resp.json().items():
                if op == 'BRPOP' and val != None:
                    key, resp = val
                    resp = json.loads(resp)
                    return resp

        return None

    def run(self):
        global ss

        ss.setdefault(self.i, {})
        ss[self.i]['start'] = time.time()

        resp = None
        need_resend = True
        while need_resend:
            if self.send_request():
                wait_for_resp = True
                wait_iter = 0
                while wait_for_resp:
                    wait_iter += 1
                    resp = self.get_response()
                    if resp:
                        wait_for_resp = False
                        need_resend = False
                    elif wait_iter >= 10:
                        wait_for_resp = False
                        need_resend = True
                        print('{} Resend'.format(self.i))

        ss[self.i]['stop'] = time.time()
        ms = (ss[self.i]['stop'] - ss[self.i]['start']) * 1000

        all_times.append(ms)
        print('{}. Time: {} ms, Result: {}'.format(self.i, ms, resp))

        with open('{}.csv'.format(__file__), 'a+') as f:
            f.write('{}\n'.format(ms))


all_times = []
threads = []
for i in range(len(config.sessions)):
    t = myThread(i)
    threads.append(t)

for t in threads:
    t.join()

print('')
print('Averange: {}'.format(sum(all_times) / len(all_times)))
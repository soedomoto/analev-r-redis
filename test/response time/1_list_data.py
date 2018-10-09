import datetime
import json
import os
import time

import requests
import urllib.parse
from uuid import uuid4
import config

all_times = []
for i in range(100):
    start = time.time()

    session_id = config.sessions[0]
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
                                  data='BRPOP/resp-{}/timeout/30'.format(request_id))

            for op, val in r_resp.json().items():
                if op == 'BRPOP' and val != None:
                    key, resp = val
                    resp = json.loads(resp)

    stop = time.time()
    duration = (stop - start) * 1000
    all_times.append(duration)

    print('{}. Time: {}, Result: {}'.format(i+1, duration, resp))

print('')
print('Averange: {}'.format(sum(all_times) / len(all_times)))

with open('{}.csv'.format(__file__), 'w+') as f:
    f.write('\n'.join([str(t) for t in all_times]))
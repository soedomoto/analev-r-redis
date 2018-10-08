import datetime
import json
from uuid import uuid4
import requests
import urllib.parse
import config

all_times = []
for i in range(10):
    start = datetime.datetime.now()

    session_id = config.sessions[2]
    request_id = str(uuid4())
    req = {
        'sess': session_id, 'id': request_id, 'func': 'module.all', 'args': []
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

    stop = datetime.datetime.now()
    all_times.append((stop-start).microseconds/1000)

    print('{}. Time: {}, Result: {}'.format(i+1, (stop-start).microseconds/1000, resp))

print('')
print('Averange: {}'.format(sum(all_times) / len(all_times)))

with open('{}.csv'.format(__file__), 'w+') as f:
    f.write('\n'.join([str(t) for t in all_times]))
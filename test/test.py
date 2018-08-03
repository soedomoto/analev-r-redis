import requests
import grequests as async
import uuid
import json

session_id = str(uuid.uuid4())
commands = { i: str(uuid.uuid4()) for i in range(0, 10000) }
commands = { id: { 'sess': session_id, 'id': id, 'cmd': 'i{} <- {}^2'.format(idx, idx) } for idx, id in commands.items() }

# for idx, c in enumerate(commands.values()):
#     r = requests.get('http://127.0.0.1:7379/RPUSH/inp/{}'.format(json.dumps(c)))
#     print(idx, r.text)
#
# for idx, id in enumerate(commands.keys()):
#     r = requests.get('http://127.0.0.1:7379/BLPOP/resp.{}/timeout/30'.format(id))
#     print(idx, r.json())


import aiohttp
import asyncio

async def fetch(session, url):
    async with session.get(url) as response:
        return await response.text()

async def main():
    async with aiohttp.ClientSession() as session:
        for idx, c in enumerate(commands.values()):
            html = await fetch(session, 'http://127.0.0.1:7379/RPUSH/inp/{}'.format(json.dumps(c)))
            print(idx, html)

        for idx, id in enumerate(commands.keys()):
            html = await fetch(session, 'http://127.0.0.1:7379/BLPOP/resp.{}/timeout/30'.format(id))
            print(idx, html)

loop = asyncio.get_event_loop()
loop.run_until_complete(main())
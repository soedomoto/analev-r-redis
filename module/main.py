#!/usr/bin/env python3

import os
import redis
import MySQLdb

r = redis.StrictRedis(host=os.getenv('REDIS_HOST', 'localhost'), decode_responses=True)

while True:
	r.brpop('req-module-all', timeout=60)
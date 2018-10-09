library(redux)
library(processx)

app.dir <- Sys.getenv('APP_DIR', '/app')
source(normalizePath(file.path(app.dir, 'util.R')))

conn <- redux::hiredis()
max.worker <- as.integer(Sys.getenv('MAX_WORKER', 10))

while(1) {
	n.worker <- conn$LLEN("worker.pids")
	n.worker <- as.integer(n.worker)
	if (n.worker > 0) {
		alive.worker.pids <- c()

		while(1) {
			worker.pid <- conn$RPOP("worker.pids")
			if (! is.null(worker.pid)) {
				if (processx:::process__exists(as.integer(worker.pid))) {
					alive.worker.pids <- c(alive.worker.pids, as.integer(worker.pid))
				}
			} else {
				break
			}
		}

		for (pid in alive.worker.pids) conn$LPUSH("worker.pids", pid)
	} else {
		workers.tobe.spawned <- max.worker - n.worker
		for (i in 1:workers.tobe.spawned) {
			process$new(Rscript_binary(), c(normalizePath(file.path(app.dir, 'worker.R'))))
		}
	}

	Sys.sleep(10)
}
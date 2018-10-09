
library(redux)
library(jsonlite)
library(processx)

app.dir <- Sys.getenv('APP_DIR', '/app')
source(normalizePath(file.path(app.dir, 'util.R')))

# Launch process.R
process$new(Rscript_binary(), c(normalizePath(file.path(app.dir, 'process.R'))))

# processx:::supervisor_ensure_running()
conn <- redux::hiredis()

spawn.process <- function(req.sess) {
    session.r.file <- normalizePath(file.path(app.dir, 'session.R'))
    p <- process$new(Rscript_binary(), c(session.r.file, req.sess))
    conn$SET(paste0("session-pid-", req.sess), p$get_pid())
}

while(1) {
    # # Capture input
    # inp.arr <- conn$BRPOP("req", 60)
    # inp.req <- inp.arr[[2]]

    # if (! is.null(inp.req)) {
    #     inp.arr <- fromJSON(inp.req)
    #     req.sess <- inp.arr$sess

    #     # cat("Request from", req.sess, "\n")
    #     conn$LPUSH("log", paste(script.name(), "-", "Request from", req.sess))
    #     conn$LPUSH(paste0("req-", req.sess), inp.req)

    #     is.proc.alive <- FALSE
    #     while (!is.proc.alive) {
    #         pid.arr <- conn$GET(paste0("session-pid-", req.sess))
            
    #         if (! is.null(pid.arr)) {
    #             if (processx:::process__exists( as.integer(pid.arr) )) {
    #                 is.proc.alive <- TRUE
    #                 next
    #             }
    #         }

    #         spawn.process(req.sess)
    #         Sys.sleep(1)
    #     }
    # }

    inp.arr <- conn$BRPOP("req", 5)
    inp.req <- inp.arr[[2]]

    if (! is.null(inp.req)) {
        conn$LPUSH("worker-req", inp.req)
    }
}
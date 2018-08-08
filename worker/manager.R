
library(redux)
library(jsonlite)
library(processx)

app.dir <- Sys.getenv('APP_DIR', '/app')

is_windows <- function () (tolower(.Platform$OS.type) == "windows")

R_binary <- function () {
  R_exe <- ifelse (is_windows(), "R.exe", "R")
  return(file.path(R.home("bin"), R_exe))
}

Rscript_binary <- function () {
  R_exe <- ifelse (is_windows(), "Rscript.exe", "Rscript")
  return(file.path(R.home("bin"), R_exe))
}

processx:::supervisor_ensure_running()
conn <- redux::hiredis()

spawn.process <- function(req.sess) {
    session.r.file <- normalizePath(file.path(app.dir, 'session.R'))
    p <- process$new(Rscript_binary(), c(session.r.file, req.sess))
    conn$SET(paste0("session-pid-", req.sess), p$get_pid())
}

while(1) {
    # Capture input
    inp.arr <- conn$BRPOP("req", 60)
    inp.req <- inp.arr[[2]]

    if (! is.null(inp.req)) {
        inp.arr <- fromJSON(inp.req)
        req.sess <- inp.arr$sess

        cat("Request from", req.sess, "\n")
        conn$LPUSH(paste0("req-", req.sess), inp.req)

        is.proc.alive <- FALSE
        is.alive.timeout <- 1
        while(! is.proc.alive) {
            is.alive.arr <- conn$BRPOP(paste0("alive-", req.sess), is.alive.timeout)
            is.alive <- is.alive.arr[[2]]
            if (! is.null(is.alive)) {
                cat("Worker", req.sess, " is alive\n")
                is.proc.alive <<- TRUE
            } else {
                cat("Worker", req.sess, " is dead. Restarting...\n")
                spawn.process(req.sess)
                is.alive.timeout <<- 3
            }
        }
    }
}
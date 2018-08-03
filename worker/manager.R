
library(redux)
library(jsonlite)
library(processx)

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

while(1) {
    # Capture input
    inp.arr <- conn$BLPOP("inp", 60)
    inp.req <- inp.arr[[2]]

    if (! is.null(inp.req)) {
        inp.req <- fromJSON(inp.req)
        req.sess <- inp.req$sess
        req.id <- inp.req$id
        req.cmd <- inp.req$cmd

        # Queuing
        cat("Command from", req.sess, "\n")
        conn$LPUSH(paste0("inp.", req.sess), toJSON(list('id'=req.id, 'cmd'=req.cmd)))

        # Check child process
        pid = conn$GET(paste0("pid.", req.sess))
        if (! is.null(pid)) {
            proc.exists = processx:::process__exists(as.integer(pid))
            if (proc.exists) next
        }

        # Spawn child process
        p <- process$new(Rscript_binary(), c("/app/session.R", req.sess), supervise=TRUE)
        conn$SET(paste0("pid.", req.sess), p$get_pid())
    }
}
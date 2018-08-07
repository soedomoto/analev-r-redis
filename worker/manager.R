
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
    inp.arr <- conn$BRPOP("req", 60)
    inp.req <- inp.arr[[2]]

    if (! is.null(inp.req)) {
        inp.arr <- fromJSON(inp.req)
        req.sess <- inp.arr$sess

        cat("Request from", req.sess, "\n")
        conn$LPUSH(paste0("req-", req.sess), inp.req)

        # Check child process
        pid = conn$GET(paste0("session-pid-", req.sess))
        if (! is.null(pid)) {
            proc.exists = processx:::process__exists(as.integer(pid))
            if (! proc.exists) next
        }

        # Spawn child process
        p <- process$new(Rscript_binary(), c("/app/session.R", req.sess), supervise=TRUE)
        cat("Worker is spawn with pid ", p$get_pid(), "\n")
        # cat(p$read_error_lines())
        # cat(p$read_output_lines())

        conn$SET(paste0("session-pid-", req.sess), p$get_pid())



        # if (! is.null(req.cmd)) {
        #     # Queuing
        #     cat("Command from", req.sess, "\n")
        #     conn$LPUSH(paste0("cmd:req:", req.sess), toJSON(list('id'=req.id, 'cmd'=req.cmd)))

        #     # Check child process
        #     pid = conn$GET(paste0("cmd:pid:", req.sess))
        #     if (! is.null(pid)) {
        #         proc.exists = processx:::process__exists(as.integer(pid))
        #         if (proc.exists) next
        #     }

        #     # Spawn child process
        #     p <- process$new(Rscript_binary(), c("/app/session.R", req.sess), supervise=TRUE)
        #     conn$SET(paste0("pid.", req.sess), p$get_pid())
        # } 

        # else if (! is.null(req.func)) {
        #     # Queuing
        #     cat("RPC from", req.sess, "\n")
        #     conn$RPUSH(paste0("rpc:req:", req.sess), toJSON(list('id'=req.id, 'func'=req.func, 'args'=req.args)))

        #     # Check child process
        #     pid = conn$GET(paste0("rpc:pid:", req.sess))
        #     if (! is.null(pid)) {
        #         proc.exists = processx:::process__exists(as.integer(pid))
        #         if (proc.exists) next
        #     }

        #     # Spawn child process
        #     p <- process$new(Rscript_binary(), c("/app/rpc_worker.R", req.sess), supervise=TRUE)
        #     conn$SET(paste0("rpc:pid:", req.sess), p$get_pid())
        # }
    }
}
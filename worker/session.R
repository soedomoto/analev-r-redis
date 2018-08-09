
args <- commandArgs(trailingOnly=TRUE)

if (length(args) < 1) {
  stop("1st argument as \'session\' must be supplied.", call.=FALSE)
}

req.sess <- args[1]
app.dir <- Sys.getenv('APP_DIR', '/app')
workspace.dir <- Sys.getenv('WORKSPACE_DIR', '/workspace')

# Restore session
session.dir <- normalizePath(file.path(workspace.dir, req.sess))
session.rdata <- normalizePath(file.path(session.dir, 'session.Rdata'))

if (!dir.exists(session.dir)) {
    dir.create(session.dir, showWarnings = FALSE, recursive = TRUE)
}

if (file.exists(session.rdata)) {
    load(file=session.rdata)
    setwd(session.dir)
}

# Write pid
pid.pid <- normalizePath(file.path(session.dir, 'pid.pid'))
cat(Sys.getpid(),file=pid.pid,sep="\n")

library(redux)
library(jsonlite)
library(foreign)
library(readxl)

source(normalizePath(file.path(app.dir, 'util.R')))
source(normalizePath(file.path(app.dir, 'converter.R')))
file.sources = list.files(c(normalizePath(file.path(app.dir, 'rpc_helper'))), pattern="*.R$", full.names=TRUE, ignore.case=TRUE)
sapply(file.sources, source, .GlobalEnv)

conn <- redux::hiredis()
# conn$SET(paste0("session-pid-", req.sess), Sys.getpid())

while(1) {
    # Capture input
    inp.arr <- conn$BRPOP(paste0("req-", req.sess), 60)
    inp.req <- inp.arr[[2]]

    # Report whether worker is alive
    conn$LPUSH(paste0("alive-", req.sess), 1)

    if (! is.null(inp.req)) {

        inp.req <- fromJSON(inp.req)
        req.id <- inp.req$id
        req.cmd <- inp.req$cmd
        req.func <- inp.req$func
        req.args <- inp.req$args

        # Processing
        err.code <- 0
        resp.str <- 'Failed';

        tryCatch({

            if (! is.null(req.cmd)) {
                eval(parse(text='png(file="tmp.png")'))

                if (grepl('ggplot', req.cmd, fixed=TRUE)) {
                    req.cmd <<- paste(req.cmd, '\n', 'ggsave("tmp.png")', sep='')
                }

                resp.obj <<- eval(parse(text=req.cmd))

                eval(parse(text='dev.off()'))

                resp.obj <<- process.response(resp.obj, err.code)
            }

            else if (! is.null(req.func)) {
                if (length(req.args) > 0) {
                    resp.obj <<- do.call(req.func, as.list(req.args), envir=environment())
                } else {
                    resp.obj <<- do.call(req.func, as.list(req.args), envir=environment())
                }
            }

        }, error = function(e) {
            err.code <<- 1
            resp.obj <<- capture.output(e)
        })

        resp.str <- toJSON(list('session'=req.sess, 'id'=req.id, 'data'=resp.obj, 'success'=as.logical(1-err.code)), auto_unbox=TRUE, force=TRUE)
        conn$LPUSH(paste0("resp-", req.id), resp.str)

        # Save session for next purpose
        save.image(file=session.rdata)
    }
}

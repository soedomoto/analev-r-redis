
args <- commandArgs(trailingOnly=TRUE)

if (length(args) < 1) {
  stop("1st argument as \'session\' must be supplied.", call.=FALSE)
}

req.sess <- args[1]

if (!dir.exists(paste0('/workspace/', req.sess))) {
    dir.create(paste0('/workspace/', req.sess), showWarnings = FALSE, recursive = TRUE)
}

if (file.exists(paste0('/workspace/', req.sess, '/session.Rdata'))) {
    load(file=paste0('/workspace/', req.sess, '/session.Rdata'))
    setwd(paste0('/workspace/', req.sess))
}

library(redux)
library(jsonlite)

source('/app/util.R')
source('/app/converter.R')
file.sources = list.files(c('/app/rpc_helper'), pattern="*.R$", full.names=TRUE, ignore.case=TRUE)
sapply(file.sources, source, .GlobalEnv)

conn <- redux::hiredis()

while(1) {
    # Capture input
    inp.arr <- conn$BRPOP(paste0("req-", req.sess), 60)
    inp.req <- inp.arr[[2]]

    if (! is.null(inp.req)) {
        inp.req <- fromJSON(inp.req)
        req.id <- inp.req$id
        req.cmd <- inp.req$cmd
        req.func <- inp.req$func
        req.args <- inp.req$args

        # Processing
        err.code <- 0
        resp.str <- 'Failed';

        if (! is.null(req.cmd)) {
            tryCatch({
                eval(parse(text='png(file="tmp.png")'))

                if (grepl('ggplot', req.cmd, fixed=TRUE)) {
                    req.cmd <<- paste(req.cmd, '\n', 'ggsave("tmp.png")', sep='')
                }

                resp.obj <<- eval(parse(text=req.cmd))

                eval(parse(text='dev.off()'))
            }, error = function(e) {
                err.code <<- 1
                resp.obj <<- message(e)
            })

            resp.obj <<- process.response(resp.obj, err.code)
        }

        else if (! is.null(req.func)) {
            tryCatch({
                if (length(req.args) > 0) {
                    resp.obj <<- do.call(req.func, as.list(req.args), envir=environment())
                } else {
                    resp.obj <<- do.call(req.func, as.list(req.args), envir=environment())
                }
            }, error = function(e) {
                err.code <<- 1
                resp.obj <<- capture.output(e)
            })
        }

        resp.str <- toJSON(list('session'=req.sess, 'id'=req.id, 'data'=resp.obj, 'error'=err.code))
        conn$RPUSH(paste0("resp-", req.id), resp.str)

        # Save session for next purpose
        save.image(file=paste0('/workspace/', req.sess, '/session.Rdata'))
    }
}

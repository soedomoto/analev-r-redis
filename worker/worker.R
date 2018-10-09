library(redux)
library(jsonlite)
library(foreign)
library(readxl)

workspace.dir <- Sys.getenv('WORKSPACE_DIR', '/workspace')
app.dir <- Sys.getenv('APP_DIR', '/app')
module.dir <- Sys.getenv('MODULE_DIR', '/module')

source(normalizePath(file.path(app.dir, 'util.R')))
source(normalizePath(file.path(app.dir, 'converter.R')))
file.sources = list.files(c(normalizePath(file.path(app.dir, 'rpc_helper'))), pattern="*.R$", full.names=TRUE, ignore.case=TRUE)
sapply(file.sources, source, .GlobalEnv)

conn <- redux::hiredis()
pid <- Sys.getpid()

conn$LPUSH("log", paste("New worker spawned with pid", pid))
conn$LPUSH("worker.pids", pid)

while(1) {
	# Capture input
    inp.arr <- conn$BRPOP("worker-req", 5)

    tryCatch({
	    inp.req <- inp.arr[[2]]
	    if (! is.null(inp.req)) {
	    	inp.req <- fromJSON(inp.req)
	    	req.sess <- inp.req$sess
	        req.id <- inp.req$id
	        req.cmd <- inp.req$cmd
	        req.func <- inp.req$func
	        req.args <- inp.req$args

	        # Session properties
			session.dir <- file.path(workspace.dir, req.sess)
			if (! dir.exists(session.dir)) {
			    dir.create(session.dir, showWarnings = FALSE, recursive = TRUE)
			}

			session.save <- function(data.json) {
			    data.file <- normalizePath(file.path(session.dir, 'session.json'))
			    cat(data.json, file=data.file, sep="\n")
			}

			session.read <- function() {
			    library(readr)
			    
			    data.file <- file.path(session.dir, 'session.json')
			    if (file.exists(data.file)) {
			        data.json <- read_file(data.file)
			        return(data.json)
			    }

			    return("")
			}

			working.env <- new.env()

			session.rdata <- file.path(session.dir, 'session.Rdata')
			if (file.exists(session.rdata)) {
			    # load(file=session.rdata)
			    # setwd(session.dir)

			    e <- new.env()
				load(file=session.rdata, envir = e)
				working.env <<- e$working.env
			}

			# session.pid <- file.path(session.dir, 'pid.pid')
			working.env$req.sess = req.sess
			working.env$req.id = req.id
			working.env$conn = conn

			# Processing
	        err.code <- 0
	        resp.str <- 'Failed';

	        tryCatch({

	            if (! is.null(req.cmd)) {
	                conn$LPUSH("log", paste(script.name(), paste0("[", req.sess, "]"), "-", "Executing command..."))
	                conn$LPUSH("log", capture.output(req.cmd))

	                # eval(parse(text='png(file="tmp.png")'))

	                # if (grepl('ggplot', req.cmd, fixed=TRUE)) {
	                #     req.cmd <<- paste0(req.cmd, '\n', 'ggsave("tmp.png")')
	                # }

	                resp.obj <<- eval(parse(text=req.cmd), envir=working.env)

	                # eval(parse(text='dev.off()'))

	                conn$LPUSH("log", paste(capture.output(resp.obj), collapse = '\n'))
	                resp.obj <<- process.response(resp.obj, err.code)
	            }

	            else if (! is.null(req.func)) {
	                conn$LPUSH("log", paste(script.name(), paste0("[", req.sess, "]"), "-", "Calling function", paste0("\"", req.func, "\""), "..."))

	                resp.obj <<- do.call(req.func, as.list(req.args), envir=working.env)

	                if(is.logical(resp.obj)) {
	                    if (resp.obj == FALSE) next
	                }
	            }

	            # Save session for next purpose
		        conn$LPUSH("log", paste(paste(ls(envir=working.env), collapse=' '), "->", session.rdata))
		        save(working.env, file = session.rdata)
		        # save(file=session.rdata, envir = working.env)

	        }, error = function(e) {
	            err.code <<- 1
	            resp.obj <<- capture.output(e)
	            
	            conn$LPUSH("log", paste(script.name(), paste0("[", req.sess, "]"), "-", "Error :", resp.obj))
	        })

	        resp.str <- toJSON(list('session'=req.sess, 'id'=req.id, 'data'=resp.obj, 'success'=as.logical(1-err.code)), auto_unbox=TRUE, force=TRUE)
	        conn$LPUSH(paste0("resp-", req.id), resp.str)
	    }
    }, error = function(e) {        
        conn$LPUSH("log", capture.output("error"))
    })
}

args <- commandArgs(trailingOnly=TRUE)

if (length(args) < 1) {
  stop("1st argument as \'session\' must be supplied.", call.=FALSE)
}

req.sess <- args[1]
workspace.dir <- Sys.getenv('WORKSPACE_DIR', '/workspace')

# Session properties
session.dir <- normalizePath(file.path(workspace.dir, req.sess))
session.rdata <- file.path(session.dir, 'session.Rdata')
session.pid <- file.path(session.dir, 'pid.pid')

if (! dir.exists(session.dir)) {
    dir.create(session.dir, showWarnings = FALSE, recursive = TRUE)
}

if (file.exists(session.rdata)) {
    load(file=session.rdata)
    setwd(session.dir)
}

# 
app.dir <- Sys.getenv('APP_DIR', '/app')
module.dir <- Sys.getenv('MODULE_DIR', '/module')

# Load libraries and sources -> make memory huge
# lapply(.packages(all.available = TRUE), function(xx) tryCatch({ 
#     if(! (xx %in% (.packages()))) library(xx, character.only = TRUE) 
# }, error = function(e) {}) )

library(redux)
library(jsonlite)
library(foreign)
library(readxl)

source(normalizePath(file.path(app.dir, 'util.R')))
source(normalizePath(file.path(app.dir, 'converter.R')))
file.sources = list.files(c(normalizePath(file.path(app.dir, 'rpc_helper'))), pattern="*.R$", full.names=TRUE, ignore.case=TRUE)
sapply(file.sources, source, .GlobalEnv)

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

# Write pid
cat(Sys.getpid(), file=session.pid, sep="\n")

redis <- redux::hiredis()
redis$LPUSH("log", paste(script.name(), paste0("[", req.sess, "]"), "-", "Starting..."))

while(1) {
    # Capture input
    inp.arr <- redis$BRPOP(paste0("req-", req.sess), 60)
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

        tryCatch({

            if (! is.null(req.cmd)) {
                redis$LPUSH("log", paste(script.name(), paste0("[", req.sess, "]"), "-", "Executing command..."))
                redis$LPUSH("log", capture.output(req.cmd))

                eval(parse(text='png(file="tmp.png")'))

                if (grepl('ggplot', req.cmd, fixed=TRUE)) {
                    req.cmd <<- paste(req.cmd, '\n', 'ggsave("tmp.png")', sep='')
                }

                resp.obj <<- eval(parse(text=req.cmd))
                # resp.obj <<- evaluate(req.cmd, envir=environment())
                # resp.obj <<- evals(req.cmd, parse=TRUE)
                # resp.obj <<- (Rserve.eval(parse(text=req.cmd)))

                eval(parse(text='dev.off()'))

                redis$LPUSH("log", paste(capture.output(resp.obj), collapse = '\n'))
                resp.obj <<- process.response(resp.obj, err.code)
            }

            else if (! is.null(req.func)) {
                redis$LPUSH("log", paste(script.name(), paste0("[", req.sess, "]"), "-", "Calling function", paste0("\"", req.func, "\""), "..."))

                resp.obj <<- do.call(req.func, as.list(req.args), envir=environment())
                if(is.logical(resp.obj)) {
                    if (resp.obj == FALSE) next
                }
            }

        }, error = function(e) {
            err.code <<- 1
            resp.obj <<- capture.output(e)
            
            redis$LPUSH("log", paste(script.name(), paste0("[", req.sess, "]"), "-", "Error :", resp.obj))
        })

        resp.str <- toJSON(list('session'=req.sess, 'id'=req.id, 'data'=resp.obj, 'success'=as.logical(1-err.code)), auto_unbox=TRUE, force=TRUE)
        redis$LPUSH(paste0("resp-", req.id), resp.str)

        # Save session for next purpose
        save.image(file=session.rdata)
    }
}


# resp.obj <<- evaluate("\n      # library(...) \n\n\n      int <- \"\"\n\n      dataset <- df0\n\n      r_var <- \"price\"\n\n      e_vars <- \"carat:clarity\"\n\n      dataset_name <- \"Diamond\"\n\n      dataset <- get_data(dataset, c(r_var, e_vars))\n\n\n      var_check <- function(ev, cn, intv = \"\") {\n\n        vars <- ev\n\n        if (length(vars) < length(cn)) vars <- ev <- cn\n\n\n        if (intv != \"\" && length(vars) > 1) {\n\n          if ({\n\n            intv %>% strsplit(\":\") %>% unlist()\n\n          } %in% vars %>% all()) {\n\n            vars <- c(vars, intv)\n\n          } else {\n\n            intv <- \"\"\n\n          }\n\n        }\n\n\n        list(vars = vars, ev = ev, intv = intv)\n\n      }\n\n\n      minmax <- function(dataset) {\n\n        isNum <- sapply(dataset, is.numeric)\n\n        if (sum(isNum) == 0) return(dataset)\n\n        cn <- names(isNum)[isNum]\n\n\n        mn <- summarise_at(dataset, .vars = cn, .funs = funs(min(., na.rm = TRUE)))\n\n        mx <- summarise_at(dataset, .vars = cn, .funs = funs(max(., na.rm = TRUE)))\n\n\n        list(min = mn, max = mx)\n\n      }\n\n\n      sig_stars <- function(pval) {\n\n        sapply(pval, function(x) x < c(.001, .01, .05, .1)) %>%\n\n          colSums() %>%\n\n          add(1) %>%\n\n          c(\"\", \".\", \"*\", \"**\", \"***\")[.]\n\n      }\n\n\n      vars <- \"\"\n\n      var_check(e_vars, colnames(dataset)[-1], int) %>%\n\n      {vars <<- .$vars; evar <<- .$ev; int <<- .$intv}\n\n\n      mmx <- minmax(dataset)\n\n\n      form_upper <- paste(r_var, \"~\", paste(vars, collapse = \" + \")) %>% as.formula()\n\n      form_lower <- paste(r_var, \"~ 1\") %>% as.formula()\n\n\n      model <- lm(form_upper, data = dataset)\n\n\n      attr(model$model, \"min\") <- mmx[[\"min\"]]\n\n      attr(model$model, \"max\") <- mmx[[\"max\"]]\n\n\n      coeff <- tidy(model) %>% as.data.frame()\n\n      colnames(coeff) <- c(\"  \", \"coefficient\", \"std.error\", \"t.value\", \"p.value\")\n\n\n      coeff$sig_star  <- sig_stars(coeff$p.value) %>% format(justify = \"left\")\n\n      colnames(coeff) <- c(\"label\", \"coefficient\", \"std.error\", \"t.value\", \"p.value\", \"sig_star\")\n\n\n      hasLevs <- sapply(dplyr::select(dataset, -1), function(x) is.factor(x) || is.logical(x) || is.character(x))\n\n      if (sum(hasLevs) > 0) {\n\n        for (i in names(hasLevs[hasLevs])) {\n\n          coeff$label %<>% gsub(paste0(\"^\", i), paste0(i, \"|\"), .) %>%\n\n            gsub(paste0(\":\", i), paste0(\":\", i, \"|\"), .)\n\n        }\n\n        rm(i)\n\n      }\n\n\n      cat(\"Linear regression (OLS)\")\n\n\n    ", envir=environment())
# resp.obj
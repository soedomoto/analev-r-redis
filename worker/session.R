
args <- commandArgs(trailingOnly=TRUE)

if (length(args) < 1) {
  stop("1st argument as \'session\' must be supplied.", call.=FALSE)
}

req.sess <- args[1]

library(redux)
library(jsonlite)
source('/app/converter.R')

conn <- redux::hiredis()

while(1) {
    # Capture input
    inp.arr <- conn$BRPOP(paste0("inp.", req.sess), 60)
    req.cmd.str <- inp.arr[[2]]

    # Processing
    err_code <- 0
    resp <- 'Failed';

    if (! is.null(req.cmd.str)) {
        tryCatch({
            req.cmd.arr = fromJSON(req.cmd.str)
            req.id = req.cmd.arr$id
            req.cmd = req.cmd.arr$cmd

            eval(parse(text='png(file="tmp.png")'));

            if (grepl('ggplot', req.cmd, fixed=TRUE)) {
                cmd = paste(req.cmd, '\n', 'ggsave("tmp.png")', sep='');
            }

            resp <<- eval(parse(text=req.cmd));

            # if (grepl('<-', req.cmd)) {
            #     cat('[', session.port, ']', 'Executing command', req.cmd, '\n');
            #
            #     eval(parse(text=req.cmd));
            #     resp <<- 'OK';
            # } else {
            #     cat('[', session.port, ']', 'Evaluating command', req.cmd, '\n');
            #     resp <<- eval(parse(text=req.cmd));
            # }

            eval(parse(text='dev.off()'))
        }, error = function(e) {
            message(e)
            err_code <<- 1
            resp <<- e
        })

        resp.json <- list('session'=req.sess, 'id'=req.id, 'data'=process.response(resp, err_code), 'error'=err_code)
        resp.json <- toJSON(resp.json)

        # Save session for next purpose
        # save.image(file=session.filename.fullpath)

        # Reply
        conn$RPUSH(paste0("resp.", req.id), resp.json)
    }
}

library(redux)

conn <- redux::hiredis()

while(1) {
    # Capture input
    inp.arr <- conn$BRPOP(paste0("log"), 60)
    inp.log <- inp.arr[[2]]

    if (! is.null(inp.log)) {
    	cat(inp.log, '\n')
    }
}
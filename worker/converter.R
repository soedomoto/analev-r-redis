process.dataframe <- function(resp) {
    library(xtable)
    str.table <- print(xtable(resp), type='html')
    return(str.table)
}

process.dataframe.to.csv <- function(resp) {
    zz <- textConnection("foo1", "w") 
    write.csv(resp, zz) 
    csv.str <- textConnectionValue(zz) 
    return(csv.str)
}

process.response <- function(resp, err_code) {
    library(jsonlite)

    # dtype <- typeof(resp)
    dstart <- proc.time()

    if (is.data.frame(resp)) {
        dtype <- 'table'
        dresp <- process.dataframe.to.csv(resp)
    }

    else if(file.exists("tmp.png") && err_code == 0) {
        b64i <- base64enc::base64encode(readBin("tmp.png", "raw", file.info("tmp.png")[1, "size"]), "txt")
        unlink("tmp.png")
        dtype <- 'image'
        dresp <- b64i
    }

    else if (typeof(resp) == 'closure') {
        dtype <- 'plain'
        dresp <- 'OK'
    }

    else {
        dtype <- 'plain'
        # dresp <- toString(resp)

        out <- capture.output(resp)
        dresp <- paste(out, collapse = '\n')
    }

    # eval(parse(text='if(file.exists("tmp.png")) { b64i <- base64enc::base64encode(readBin("tmp.png", "raw", file.info("tmp.png")[1, "size"]), "txt"); unlink("tmp.png"); }'));
    # resp <<- eval(parse(text="b64i"));

    dend <- proc.time()
    dresp <- list('type'=dtype, 'text'=dresp, 'time'=toString(dend-dstart))

    return(dresp)
}
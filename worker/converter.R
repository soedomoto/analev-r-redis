process.dataframe <- function(resp) {
    library(xtable)

    str.table <- print(xtable(resp), type='html')
    return(str.table)
}

process.dataframe.to.csv <- function(resp) {
    library(readr)

    write.table(resp, row.names=FALSE, na="", sep=",", file=".tmp.csv")
    return(read_file(".tmp.csv"))

    # zz <- textConnection("foo1", "w") 
    # write.csv(resp, zz) 
    # csv.str <- textConnectionValue(zz) 
    # close(zz)
    # return(csv.str)
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

    else if (is.character(resp)) {
        dtype <- 'plain'
        dresp <- resp

        # resp <- capture.output(resp)
        # dresp <- paste(resp, collapse = '\n')
    } 

    else {
        dtype <- 'plain'
        dresp <- paste(capture.output(resp), collapse = '\n')
    }

    # eval(parse(text='if(file.exists("tmp.png")) { b64i <- base64enc::base64encode(readBin("tmp.png", "raw", file.info("tmp.png")[1, "size"]), "txt"); unlink("tmp.png"); }'));
    # resp <<- eval(parse(text="b64i"));

    dend <- proc.time()
    dresp <- list('type'=dtype, 'text'=dresp, 'time'=toString(dend-dstart))

    return(dresp)
}
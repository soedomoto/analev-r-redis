data.get_catalogues <- function() {
    library(RMySQL)
    
    db <- database.mysql()
    rs <- dbSendQuery(db, 'SELECT id, label FROM data_model')
    rows <- dbFetch(rs)

    return(rows)
}

data.read <- function(cat.id, var.name) {
    library(stringr)

    db <- database.mysql()
    rs <- dbSendQuery(db, paste0('SELECT location, r_handler FROM data_model WHERE id = "', cat.id, '"'))
    row <- dbFetch(rs)

    df <- eval(parse(text=str_replace(row$r_handler, "\\?", paste0('"', row$location, '"'))))
    assign(var.name, df, envir=parent.frame(1))

    csv <- process.dataframe.to.csv(head(df))

    return(csv)
}
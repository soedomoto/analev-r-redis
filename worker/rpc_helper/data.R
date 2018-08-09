data.get_catalogues <- function() {
    library(RMySQL)

    db <- dbConnect(MySQL(), user=Sys_getenv("MYSQL_USER", 'root'), password=Sys_getenv("MYSQL_PASSWORD", 'toor'), dbname=Sys_getenv("MYSQL_DATABASE", 'analev'), host=Sys_getenv("MYSQL_HOST", '127.0.0.1'))
    on.exit(dbDisconnect(db))
    rs <- dbSendQuery(db, 'SELECT id, label FROM data_model')
    rows <- dbFetch(rs)

    return(rows)
}

data.read <- function(cat.id, var.name) {
    library(RMySQL)
    require(stringr)

    db <- dbConnect(MySQL(), user=Sys_getenv("MYSQL_USER", 'root'), password=Sys_getenv("MYSQL_PASSWORD", 'toor'), dbname=Sys_getenv("MYSQL_DATABASE", 'analev'), host=Sys_getenv("MYSQL_HOST", '127.0.0.1'))
    rs <- dbSendQuery(db, paste0('SELECT location, r_handler FROM data_model WHERE id = "', cat.id, '"'))
    row <- dbFetch(rs)

    df <- eval(parse(text=paste(var.name, '<<-', str_replace(row$r_handler, "\\?", paste0('"', row$location, '"')))))
    csv <- process.dataframe.to.csv(head(df))

    return(csv)
}
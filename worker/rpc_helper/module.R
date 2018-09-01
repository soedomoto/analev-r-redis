mysql.db <- NULL;
database.mysql <- function() {
    if (is.null(mysql.db)) {
        mysql.db <<- dbConnect(MySQL(), user=Sys_getenv("MYSQL_USER", 'root'), password=Sys_getenv("MYSQL_PASSWORD", 'toor'), dbname=Sys_getenv("MYSQL_DATABASE", 'analev'), host=Sys_getenv("MYSQL_HOST", '127.0.0.1'));
    }

    return(mysql.db);
}

module.all <- function() {
    library(RMySQL)

    db <- database.mysql()
    rs <- dbSendQuery(db, 'SELECT id, name, label FROM module_model')
    rows <- dbFetch(rs)

    return(rows)
}

module.read <- function(mod.id) {
    library(RMySQL)
    library(readr)

    db <- database.mysql()
    rs <- dbSendQuery(db, paste0('SELECT location FROM module_model WHERE id = "', mod.id, '"'))
    row <- dbFetch(rs)

    mod.loc <- file.path(module.dir, row$location)
    return(read_file(mod.loc))
}
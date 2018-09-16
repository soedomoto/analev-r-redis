mysql.db <- NULL;
database.mysql <- function() {
    library(RMySQL)
    
    if (is.null(mysql.db)) {
        mysql.db <<- dbConnect(MySQL(), user=Sys_getenv("MYSQL_USER", 'root'), password=Sys_getenv("MYSQL_PASSWORD", 'toor'), dbname=Sys_getenv("MYSQL_DATABASE", 'analev'), host=Sys_getenv("MYSQL_HOST", '127.0.0.1'));
    }

    return(mysql.db);
}

module.all <- function() {
    db <- database.mysql()
    rs <- dbSendQuery(db, 'SELECT id, name, label FROM module_model')
    rows <- dbFetch(rs)
    dbClearResult(rs)

    return(rows)
}

module.files <- function(id) {
    db <- database.mysql()
    rs <- dbSendQuery(db, paste0('SELECT id, module_id, filename, extension FROM module_file_model WHERE module_id = "', id, '"'))
    rows <- dbFetch(rs)
    dbClearResult(rs)

    return(rows)
}

module.file.read <- function(mod.id, file.name) {
    library(readr)

    mod.loc <- file.path(module.dir, mod.id, file.name)
    return(read_file(mod.loc))
}

module.file.name.read <- function(file.name) {
    library(readr)

    db <- database.mysql()
    rs <- dbSendQuery(db, paste0('SELECT id, module_id, extension FROM module_file_model WHERE filename = "', file.name, '"'))
    row <- dbFetch(rs)
    dbClearResult(rs)

    file.loc <- file.path(module.dir, row$module_id, paste0(row$id, '.', row$extension))
    return(read_file(file.loc))
}

module.file.save <- function(file.id, content) {
    db <- database.mysql()
    rs <- dbSendQuery(db, paste0('SELECT id, module_id, extension FROM module_file_model WHERE id = "', file.id, '"'))
    row <- dbFetch(rs)
    dbClearResult(rs)

    file.loc <- file.path(module.dir, row$module_id, paste0(row$id, '.', row$extension))
    cat(content, file=file.loc, sep="\n")
}

module.file.name.eval <- function(file.name, format.params) {
    library(readr)
    library(stringr)

    db <- database.mysql()
    rs <- dbSendQuery(db, paste0('SELECT id, module_id, extension FROM module_file_model WHERE filename = "', file.name, '"'))
    row <- dbFetch(rs)
    dbClearResult(rs)

    file.loc <- file.path(module.dir, row$module_id, paste0(row$id, '.', row$extension))

    # file.content <- read_file(file.loc)
    # file.content <- gsub(pattern = "#[^\\\n]*", replacement = "", x = read_file(file.loc))
    file.lines <- read_lines(file=file.loc)
    fn <- function(x) gsub(pattern = "#[^*]*", replacement = "", x = x)
    file.content <- paste(sapply(file.lines, fn), collapse="\n")

    for (name in names(format.params)) {
        file.content <- str_replace_all(file.content, paste0('\\{', name, '\\}'), format.params[[name]])
    }

    # return(file.content)

    # redis$LPUSH("log", paste(script.name(), paste0("[", req.sess, "]"), "-", paste0("Executing command...\n", file.content)))
    redis$LPUSH(paste0("req-", req.sess), toJSON(list('id'=req.id, 'cmd'=file.content)))
    return(as.logical(0))
}

module.file.ui.read <- function(mod.id) {
    library(readr)

    db <- database.mysql()
    rs <- dbSendQuery(db, paste0('SELECT id, module_id, filename, extension FROM module_file_model WHERE module_id = "', mod.id, '" AND filename = "ui"'))
    rows <- dbFetch(rs, n=1)
    dbClearResult(rs)

    mod.loc <- file.path(module.dir, mod.id, paste0(rows$id[1], '.', rows$extension[1]))
    return(read_file(mod.loc))
}

# will be deprecated
module.read <- function(mod.id) {
    library(readr)

    db <- database.mysql()
    rs <- dbSendQuery(db, paste0('SELECT location FROM module_model WHERE id = "', mod.id, '"'))
    row <- dbFetch(rs)
    dbClearResult(rs)

    mod.loc <- file.path(module.dir, row$location)
    return(read_file(mod.loc))
}
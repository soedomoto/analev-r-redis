mysql.db <- NULL;
database.mysql <- function() {
    library(RMySQL)
    
    if (is.null(mysql.db)) {
        mysql.db <<- dbConnect(MySQL(), user=Sys_getenv("MYSQL_USER", 'root'), password=Sys_getenv("MYSQL_PASSWORD", 'toor'), dbname=Sys_getenv("MYSQL_DATABASE", 'analev'), host=Sys_getenv("MYSQL_HOST", '127.0.0.1'));
    }

    return(mysql.db);
}

user.authenticate <- function(email, password) {
	library(openssl)

    db <- database.mysql()
    rs <- dbSendQuery(db, paste0('SELECT id, fullname, email FROM user_model WHERE email = "', email, '" AND password = "', md5(password), '" LIMIT 1'))
    row <- dbFetch(rs)
    dbClearResult(rs)

    now <- Sys.time()
    user.key <- "KDKE7483JJSDYF3489JSD793478382938489FJDSKF"
    user.id <- substr(gsub(pattern = "-", replacement = "", x = row$id), 0, 9)
    user.dt <- format(now, format = "%Y%m%d%H%M%S")
    user.rand <- paste(sample(LETTERS, 20, TRUE), collapse="")
    user.session <- paste0(user.id, user.dt, "00000", user.rand)
    user.hash <- md5(paste0(user.session, user.key))
    user.cookie <- paste0(user.session, user.hash)

    dbGetQuery(db, paste0('INSERT INTO cookie_model (cookie, user_id, expired_at) VALUES("', user.cookie, '", "', row$id, '", "', format(now + 2*60*60, format = "%Y-%m-%d %H:%M:%S"), '")'))

    return(user.cookie)
}
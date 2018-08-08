Sys_getenv <- function(x, unset = NULL) {
  ret <- Sys.getenv(x, NA_character_)
  if (is.na(ret)) unset else ret
}

data.path <- function(data.name) {
    data.dir <- Sys.getenv('DATA_DIR', '/data')
    data.file <- normalizePath(file.path(data.dir, data.name))
    return(data.file)
}
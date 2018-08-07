Sys_getenv <- function(x, unset = NULL) {
  ret <- Sys.getenv(x, NA_character_)
  if (is.na(ret)) unset else ret
}

data.path <- function(data.name) {
    return(paste0('/data/', data.name))
}
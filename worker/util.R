Sys_getenv <- function(x, unset = NULL) {
  ret <- Sys.getenv(x, NA_character_)
  if (is.na(ret)) unset else ret
}

script.name <- function() {
	return(sub(".*=", "", commandArgs()[6]))
}

data.path <- function(data.name) {
    data.dir <- Sys.getenv('DATA_DIR', '/data')
    data.file <- normalizePath(file.path(data.dir, data.name))
    return(data.file)
}

get_data <- function(dataset, vars = "", filt = "", rows = NULL, na.rm = TRUE) {
  filt <- gsub("\\n", "", filt) %>%
    gsub("\"", "\'", .)

  df <- dataset %>%
    {if ("grouped_df" %in% class(.)) ungroup(.) else .} %>% ## ungroup data if needed
    {if (filt == "") . else filter_data(., filt)} %>%        ## apply data_filter
    {if (is.null(rows)) . else .[rows, , drop = FALSE]} %>%
    {if (is_empty(vars[1])) . else dplyr::select(., !!! if (any(grepl(":", vars))) rlang::parse_exprs(paste0(vars, collapse = ";")) else vars)} %>%
    {if (na.rm) na.omit(.) else .}

  return(df)
}
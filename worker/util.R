is_windows <- function () (tolower(.Platform$OS.type) == "windows")

R_binary <- function () {
  R_exe <- ifelse (is_windows(), "R.exe", "R")
  return(file.path(R.home("bin"), R_exe))
}

Rscript_binary <- function () {
  R_exe <- ifelse (is_windows(), "Rscript.exe", "Rscript")
  return(file.path(R.home("bin"), R_exe))
}

Sys_getenv <- function(x, unset = NULL) {
  ret <- Sys.getenv(x, NA_character_)
  if (is.na(ret)) unset else ret
}

script.name <- function() {
	return(sub(".*=", "", commandArgs()[6]))
}

mysql.db <- NULL;
database.mysql <- function() {
    library(RMySQL)
    
    if (is.null(mysql.db)) {
        user <- Sys_getenv("MYSQL_USER", 'root')
        password <- Sys_getenv("MYSQL_PASSWORD", 'toor')
        dbname <- Sys_getenv("MYSQL_DATABASE", 'analev')
        host <- Sys_getenv("MYSQL_HOST", '127.0.0.1')

        conn$LPUSH("log", paste("Connecting to MySQL ", host, "/", dbname, " using ", user, ":", password))

        mysql.db <<- dbConnect(MySQL(), user=user, password=password, dbname=dbname, host=host);
    }

    return(mysql.db);
}

data.path <- function(data.name) {
    data.dir <- Sys.getenv('DATA_DIR', '/data')
    data.file <- normalizePath(file.path(data.dir, data.name))
    return(data.file)
}

get_data <- function(dataset, vars = "", filt = "", rows = NULL, na.rm = TRUE) {
  library(rlang)
  library(dplyr)

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

var_check <- function(ev, cn, intv = "") {
  vars <- ev
  if (length(vars) < length(cn)) vars <- ev <- cn

  if (intv != "" && length(vars) > 1) {
    if ({
      intv %>% strsplit(":") %>% unlist()
    } %in% vars %>% all()) {
      vars <- c(vars, intv)
    } else {
      intv <- ""
    }
  }

  list(vars = vars, ev = ev, intv = intv)
}

minmax <- function(dataset) {
  isNum <- sapply(dataset, is.numeric)
  if (sum(isNum) == 0) return(dataset)
  cn <- names(isNum)[isNum]

  mn <- summarise_at(dataset, .vars = cn, .funs = funs(min(., na.rm = TRUE)))
  mx <- summarise_at(dataset, .vars = cn, .funs = funs(max(., na.rm = TRUE)))

  list(min = mn, max = mx)
}

sig_stars <- function(pval) {
  sapply(pval, function(x) x < c(.001, .01, .05, .1)) %>%
    colSums() %>%
    add(1) %>%
    c("", ".", "*", "**", "***")[.]
}

format_nr <- function(
  x, sym = "", dec = 2, perc = FALSE,
  mark = ",", na.rm = TRUE, ...
) {
  if (is.data.frame(x)) x <- x[[1]]
  if (na.rm && length(x) > 0) x <- na.omit(x)
  if (perc) {
    paste0(sym, formatC(100 * x, digits = dec, big.mark = mark, format = "f", ...), "%")
  } else {
    paste0(sym, formatC(x, digits = dec, big.mark = mark, format = "f", ...))
  }
}

format_df <- function(tbl, dec = NULL, perc = FALSE, mark = "", ...) {
  frm <- function(x, ...) {
    if (is_double(x)) {
      format_nr(x, dec = dec, perc = perc, mark = mark, ...)
    } else if (is.integer(x)) {
      format_nr(x, dec = 0, mark = mark, ...)
    } else {
      x
    }
  }
  mutate_all(tbl, .funs = funs(frm))
}

sshhr <- function(...) suppressWarnings(suppressMessages(...))

is_not <- function(x) {
  length(x) == 0 || (length(x) == 1 && is.na(x))
}

is_empty <- function(x, empty = "\\s*") {
  is_not(x) || (length(x) == 1 && grepl(paste0("^", empty, "$"), x))
}

ci_label <- function(alt = "two.sided", cl = .95, dec = 3) {
  if (alt == "less") {
    c("0%", paste0(100 * cl, "%"))
  } else if (alt == "greater") {
    c(paste0(100 * (1 - cl), "%"), "100%")
  } else {
    {
      100 * (1 - cl) / 2
    } %>%
      c(., 100 - .) %>%
      round(dec) %>%
      paste0(., "%")
  }
}
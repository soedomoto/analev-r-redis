# predict.R

library(rlist)
library(dplyr)
library(stats)

x <- {dataset}
dataset_name <- "{dataset_name}"
data_filter <- "{data_filter}"
rvar <- "{r_var}"
strevar <- "{e_vars}"
interval <- "confidence"
n <- {n}
se <- TRUE
conf_lev <- {conf_lev}

output <- list()
pred <- get_data(x, c(r_var, e_vars))
evar <- unlist(strsplit(strevar, ":"))

pfun <- function(model, pred, se, conf_lev) {
  pred_val <-
    try(
      sshhr(
        predict(
          model, pred,
          interval = ifelse(se, interval, "none"),
          level = conf_lev
        )
      ),
      silent = TRUE
    )

  if (!inherits(pred_val, "try-error")) {
    if (se) {
      pred_val %<>% data.frame(stringsAsFactors = FALSE) %>% mutate(diff = .[, 3] - .[, 1])
      ci_perc <- ci_label(cl = conf_lev)
      colnames(pred_val) <- c("Prediction", ci_perc[1], ci_perc[2], "+/-")
    } else {
      pred_val %<>% data.frame(stringsAsFactors = FALSE) %>% select(1)
      colnames(pred_val) <- "Prediction"
    }
  }

  pred_val
}

# Model
vars <- evar
# var_check(strevar, colnames(x)[-1], int) %>% {vars <<- .$vars}

form_upper <- paste(rvar, "~", paste(vars, collapse = " + ")) %>% as.formula()
model <- lm(form_upper, data = x)

mmx <- minmax(x)
attr(model$model, "min") <- mmx[["min"]]
attr(model$model, "max") <- mmx[["max"]]

# Show properties
output <- list.append(output, "Linear regression (OLS)\n")
output <- list.append(output, paste0("Data                 : ", dataset_name, "\n"))
if (data_filter %>% gsub("\\s", "", .) != "") {	
	output <- list.append(output, paste0("Filter               : ", gsub("\\n", "", data_filter), "\n"))
}
output <- list.append(output, paste0("Response variable    : ", rvar, "\n"))
output <- list.append(output, paste0("Explanatory variables: ", paste(evar, collapse = ", "), "\n"))
if (!is_empty(interval, "none")) {
	output <- list.append(output, paste0("Interval             : ", interval, "\n"))
}
if (nrow(x) > n) {
	output <- list.append(output, paste0("Rows shown           : ", n, " of ", format_nr(nrow(x), dec = 0), "\n"))
}

output <- list.append(output, "\n")

# Calculate prediction
pred_names <- colnames(pred)
pred <- try(select_at(pred, .vars = vars), silent = TRUE)
pred <- na.omit(pred)
pred_val <- pfun(model, x, se = se, conf_lev = conf_lev)
pred <- data.frame(pred, pred_val, check.names = FALSE, stringsAsFactors = FALSE)

# Print result
pred.print <- head(pred, n) %>%
    format_df(attr(pred, "dec")) %>%
    print(row.names = FALSE)
output <- list.append(output, paste(capture.output(pred.print), collapse="\n"))

print(paste(output, collapse=""))
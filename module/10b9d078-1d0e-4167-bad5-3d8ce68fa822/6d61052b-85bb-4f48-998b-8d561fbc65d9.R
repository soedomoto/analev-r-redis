# summary.R

library(rlist)
library(broom)
library(dplyr)
library(magrittr)

int <- ""
dataset <- {dataset}
r_var <- "{r_var}"
e_vars <- "{e_vars}"
dataset_name <- "{dataset_name}"
data_filter <- ""
check <- ""
dec <- 3

dataset <- get_data(dataset, c(r_var, e_vars))

vars <- ""
var_check(e_vars, colnames(dataset)[-1], int) %>%
{vars <<- .$vars; evar <<- .$ev; int <<- .$intv}

mmx <- minmax(dataset)

form_upper <- paste(r_var, "~", paste(vars, collapse = " + ")) %>% as.formula()
form_lower <- paste(r_var, "~ 1") %>% as.formula()

model <- lm(form_upper, data = dataset)

attr(model$model, "min") <- mmx[["min"]]
attr(model$model, "max") <- mmx[["max"]]

coeff <- tidy(model) %>% as.data.frame()
colnames(coeff) <- c("  ", "coefficient", "std.error", "t.value", "p.value")

coeff$sig_star  <- sig_stars(coeff$p.value) %>% format(justify = "left")
colnames(coeff) <- c("label", "coefficient", "std.error", "t.value", "p.value", "sig_star")

hasLevs <- sapply(dplyr::select(dataset, -1), function(x) is.factor(x) || is.logical(x) || is.character(x))
if (sum(hasLevs) > 0) {
  for (i in names(hasLevs[hasLevs])) {
    coeff$label %<>% gsub(paste0("^", i), paste0(i, "|"), .) %>%
      gsub(paste0(":", i), paste0(":", i, "|"), .)
  }
  rm(i)
}

if (nrow(model$model) <= (length(e_vars) + 1)) {
  stop("Insufficient observations to estimate model\n")
}

e_vars <- unlist(strsplit(e_vars, ":"))
expl_var <- if (length(e_vars) == 1) e_vars else "x"
coeff$label %<>% format(justify = "left")

if (all(coeff$p.value == "NaN")) {
  coeff[, 2] %<>% {sprintf(paste0("%.", dec, "f"), .)}
  coeff.print <- paste0(
    print(coeff[, 1:2], row.names = FALSE),
    "\nInsufficient variation in explanatory variable(s) to report additional statistics"
  )
} else {
  p.small <- coeff$p.value < .001
  coeff[, 2:5] %<>% format_df(dec)
  coeff$p.value[p.small] <- "< .001"
  coeff.print <- print(rename(coeff, `  ` = "label", ` ` = "sig_star"), row.names = FALSE)
}

# Multiple print is still buggy, only last print will be shown -> use print with paste instead
output <- list(
  paste0("Linear regression (OLS)", "\n"), 
  paste0("Dataset: ", dataset_name, "\n"), 
  ifelse(data_filter %>% gsub("\\s", "", .) != "", 
    cat("Filter   :", gsub("\n", "", object$data_filter), "\n"), ""
  ), 
  paste0("Response variable    :", r_var, "\n"), 
  paste0("Explanatory variables    :", paste0(e_vars, collapse = ", "), "\n"), 
  paste0(paste0("Null hyp.: the effect of ", expl_var, " on ", r_var, " is zero"), "\n"),
  paste0(paste0("Alt. hyp.: the effect of ", expl_var, " on ", r_var, " is not zero"), "\n"),
  ifelse("standardize" %in% check, 
    "**Standardized coefficients shown (2 X SD)**\n", 
    ifelse("center" %in% check, "**Centered coefficients shown (x - mean(x))**\n", "")
  ), 
  "\n", 
  paste(capture.output(coeff.print), collapse="\n"), 
  "\n"
)

df_int <- if (attr(model$terms, "intercept")) 1L else 0L
reg_fit <- glance(model) %>% round(dec)
if (reg_fit["p.value"] < .001) reg_fit["p.value"] <- "< .001"
output <- list.append(output, "\nSignif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1\n")
output <- list.append(output, paste0("R-squared:", paste0(reg_fit$r.squared, ", "), "Adjusted R-squared:", reg_fit$adj.r.squared, "\n"))
output <- list.append(output, paste0("F-statistic:", reg_fit$statistic, paste0("df(", reg_fit$df - df_int, ",", reg_fit$df.residual, "), p.value"), reg_fit$p.value), "\n")
output <- list.append(output, paste0("Nr obs:", format_nr(reg_fit$df + reg_fit$df.residual, dec = 0), "\n"))

print(paste(output, collapse=""))

# predict.R

object <- {dataset}
pred_data <- {pred_data}
conf_lev <- {conf_lev} # default: 0.95
se <- TRUE
interval <- "confidence"
dec <- 3

set_attr <- function(x, which, value) `attr<-`(x, which, value)

predict_model <- function(
  object, pfun, mclass, pred_data = NULL, pred_cmd = "",
  conf_lev = 0.95, se = FALSE, dec = 3, ...
) {

  if (is.character(object)) return(object)
  if (is_empty(pred_data) && is_empty(pred_cmd)) {
    return("Please select data and/or specify a command to generate predictions.\nFor example, carat = seq(.5, 1.5, .1) would produce predictions for values\n of carat starting at .5, increasing to 1.5 in increments of .1. Make sure\nto press return after you finish entering the command.\n\nAlternatively, specify a dataset to generate predictions. You could create\nthis in a spread sheet and use the paste feature in Data > Manage to bring\nit into Radiant")
  }

  pred_type <- "cmd"
  vars <- object$evar
  if (!is_empty(pred_cmd) && is_empty(pred_data)) {
    dat <- object$model$model
    if ("center" %in% object$check) {
      ms <- attr(object$model$model, "ms")
      if (!is.null(ms)) {
        dat <- mutate_at(dat, .vars = names(ms), .funs = funs(. + ms$.))
      }
    } else if ("standardize" %in% object$check) {
      ms <- attr(object$model$model, "ms")
      sds <- attr(object$model$model, "sds")
      if (!is.null(ms) && !is.null(sds)) {
        dat <- mutate_at(dat, .vars = names(ms), .funs = funs(. * 2 * sds$. + ms$.))
      }
    }

    pred_cmd %<>% paste0(., collapse = ";") %>%
      gsub("\"", "\'", .) %>%
      gsub(";\\s*$", "", .) %>%
      gsub(";", ",", .)

    pred <- try(eval(parse(text = paste0("with(dat, expand.grid(", pred_cmd, "))"))), silent = TRUE)
    if (inherits(pred, "try-error")) {
      return(paste0("The command entered did not generate valid data for prediction. The\nerror message was:\n\n", attr(pred, "condition")$message, "\n\nPlease try again. Examples are shown in the help file."))
    }

    # adding information to the prediction data.frame
    dat <- select_at(dat, .vars = vars)

    if (!is.null(object$model$term)) {
      dat_classes <- attr(object$model$term, "dataClasses")[-1]
    } else {
      dat_classes <- get_class(dat)
    }

    ## weights mess-up data manipulation below so remove from
    wid <- which(names(dat_classes) %in% "(weights)")
    if (length(wid) > 0) dat_classes <- dat_classes[-wid]

    isFct <- dat_classes == "factor"
    isChar <- dat_classes == "character"
    isLog <- dat_classes == "logical"
    isNum <- dat_classes == "numeric" | dat_classes == "integer"

    # based on http://stackoverflow.com/questions/19982938/how-to-find-the-most-frequent-values-across-several-columns-containing-factors
    max_freq <- function(x) names(which.max(table(x)))
    max_ffreq <- function(x) as.factor(max_freq(x))
    max_lfreq <- function(x) ifelse(mean(x) > .5, TRUE, FALSE)

    plug_data <- data.frame(init___ = 1, stringsAsFactors = FALSE)
    if (sum(isNum) > 0) {
      plug_data %<>% bind_cols(., summarise_at(dat, .vars = vars[isNum], .funs = funs(mean)))
    }
    if (sum(isFct) > 0) {
      plug_data %<>% bind_cols(., summarise_at(dat, .vars = vars[isFct], .funs = funs(max_ffreq)))
    }
    if (sum(isChar) > 0) {
      plug_data %<>% bind_cols(., summarise_at(dat, .vars = vars[isChar], .funs = funs(max_freq)))
    }
    if (sum(isLog) > 0) {
      plug_data %<>% bind_cols(., summarise_at(dat, .vars = vars[isLog], .funs = funs(max_lfreq)))
    }

    rm(dat)

    if ((sum(isNum) + sum(isFct) + sum(isLog) + sum(isChar)) < length(vars)) {
      return("The model includes data-types that cannot be used for\nprediction at this point\n")
    } else {
      if (sum(names(pred) %in% names(plug_data)) < length(names(pred))) {
        return("The expression entered contains variable names that are not in the model.\nPlease try again.\n\n")
      } else {
        plug_data[names(pred)] <- list(NULL)
        pred <- cbind(select(plug_data, -1), pred)
      }
    }
  } else {
    ## generate predictions for all observations in the dataset
    pred <- get_data(pred_data, filt = "", na.rm = FALSE)
    pred_names <- colnames(pred)
    pred <- try(select_at(pred, .vars = vars), silent = TRUE)

    if (inherits(pred, "try-error")) {
      return(paste0("All variables in the model must also be in the prediction data\nVariables in the model: ", paste0(vars, collapse = ", "), "\nVariables not available in prediction data: ", paste0(vars[!vars %in% pred_names], collapse = ", ")))
    }

    if (!is_empty(pred_cmd)) {
      pred_cmd %<>% paste0(., collapse = ";") %>%
        gsub("\"", "\'", .) %>%
        gsub("\\s+", "", .) %>%
        gsub("<-", "=", .)

      vars <- strsplit(pred_cmd, ";")[[1]] %>%
        strsplit(., "=") %>%
        sapply("[", 1)

      dots <- rlang::parse_exprs(pred_cmd) %>%
        set_names(vars)

      pred <- try(mutate(pred, !!! dots), silent = TRUE)
      if (inherits(pred, "try-error")) {
        return(paste0("The command entered did not generate valid data for prediction. The\nerror message was:\n\n", attr(pred, "condition")$message, "\n\nPlease try again. Examples are shown in the help file."))
      }
      pred_type <- "datacmd"
    } else {
      pred_type <- "data"
    }

    pred <- na.omit(pred)
  }

  if ("crtree" %in% class(object)) {
    ## also need to update data in crtree because
    ## logicals would get < 0.5 and >= 0.5 otherwise
    pred <- mutate_if(pred, is.logical, as.factor)
  }

  ## scale predictors if needed
  if ("center" %in% object$check || "standardize" %in% object$check) {
    attr(pred, "ms") <- attr(object$model$model, "ms")
    if ("standardize" %in% object$check) {
      scale <- TRUE
      attr(pred, "sds") <- attr(object$model$model, "sds")
    } else {
      scale <- FALSE
    }
    pred_val <- scaledf(pred, center = TRUE, scale = scale, calc = FALSE) %>%
      pfun(object$model, ., se = se, conf_lev = conf_lev)
  } else {
    ## generate predictions using the supplied function (pfun)
    pred_val <- pfun(object$model, pred, se = se, conf_lev = conf_lev)
  }

  if (!inherits(pred_val, "try-error")) {
    ## scale rvar for regression models
    if ("center" %in% object$check) {
      ms <- attr(object$model$model, "ms")[[object$rvar]]
      if (!is.null(ms)) {
        pred_val[["Prediction"]] <- pred_val[["Prediction"]] + ms
      }
    } else if ("standardize" %in% object$check) {
      ms <- attr(object$model$model, "ms")[[object$rvar]]
      sds <- attr(object$model$model, "sds")[[object$rvar]]
      if (!is.null(ms) && !is.null(sds)) {
        pred_val[["Prediction"]] <- pred_val[["Prediction"]] * 2 * sds + ms
      }
    }

    pred <- data.frame(pred, pred_val, check.names = FALSE, stringsAsFactors = FALSE)
    vars <- colnames(pred)

    if (any(grepl("stepwise", object$check))) {
      ## show only the selected variables when printing predictions
      object$evar <- attr(terms(object$model), "variables") %>% as.character() %>% .[-c(1, 2)]
      vars <- c(object$evar, colnames(pred_val))
    }

    pred <- set_attr(pred, "df_name", object$df_name) %>%
      set_attr("data_filter", object$data_filter) %>%
      set_attr("rvar", object$rvar) %>%
      set_attr("lev", object$lev) %>%
      set_attr("evar", object$evar) %>%
      set_attr("wtsname", object$wtsname) %>%
      set_attr("vars", vars) %>%
      set_attr("dec", dec) %>%
      set_attr("pred_type", pred_type) %>%
      set_attr("pred_cmd", pred_cmd)

    return(add_class(pred, c(mclass, "model.predict")))
  } else {
    return(paste0("There was an error when trying to generate predictions. The\nerror message was:\n\n", attr(pred_val, "condition")$message, "\n\nPlease try again. Examples are shown in the help file."))
  }
}

if (is.character(object)) return(object)
if (isTRUE(se)) {
if (isTRUE(interval == "none")) {
  se <- FALSE
} else if ("center" %in% object$check || "standardize" %in% object$check) {
  message("Standard error calculations not supported when coefficients are centered or standardized")
  se <- FALSE; interval <- "none"
}
} else {
interval <- "none"
}

if (is.data.frame(pred_data)) {
df_name <- deparse(substitute(pred_data))
} else {
df_name <- pred_data
}

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

predict_model(object, pfun, "regress.predict", pred_data, pred_cmd, conf_lev, se, dec) %>%
set_attr("interval", interval) %>%
set_attr("pred_data", df_name)
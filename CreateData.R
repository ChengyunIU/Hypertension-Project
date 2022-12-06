library(haven)
library(gtsummary)
library(naniar)
library(dplyr)
setwd("/Users/chengyun/Desktop/IU_Courses/2022 Fall/Info 517/project2")
var <- c("J", "I", "H", "G")
year <- c("1718", "1516", "1314", "1112")
var.demo <- c("SEQN", "RIAGENDR", "RIDAGEYR", "RIDRETH3", "DMDEDUC2", "INDFMIN2")
var.bp <- c("SEQN", "BPXPLS", "BPXPULS", "BPXSY1", "BPXDI1")
index <- 1
for(i in 1:4){
  Demo <- read_xpt(file = paste0("DEMO_", var[i] ,".XPT"))
  Demo <- Demo[, var.demo]
  BP <- read_xpt(file = paste0("BPX_", var[i] ,".XPT"))
  BP <- BP[, var.bp]
  HDL <- read_xpt(file = paste0("HDL_", var[i] ,".XPT")) %>%
    filter(!is.na(LBDHDD)) %>%
    select(SEQN, LBDHDD)
  TRI <- read_xpt(file= paste0("TRIGLY_", var[i] ,".XPT")) %>%
    filter(!is.na(LBDLDL)) %>%
    select(SEQN, LBXTR, LBDLDL)
  Data <- merge(x = BP, y = Demo, by = "SEQN", all.x = TRUE)
  Data <- merge(x = Data, y = HDL, by = "SEQN", all.x = TRUE)
  Data <- merge(x = Data, y = TRI, by = "SEQN", all.x = TRUE)
  Data <- Data[Data$RIDAGEYR>20,] %>%
    filter(!is.na(BPXSY1)) %>%
    mutate(HBP=if_else((BPXSY1>130|BPXDI1>80), 1, 0))
  print(index)
  index <- index+1
  write.csv(Data, file = paste0("Data", year[i] ,".csv"), row.names=FALSE)
}
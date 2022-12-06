import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import PolynomialFeatures
from sklearn.metrics import classification_report
import numpy as np
import matplotlib.pyplot as plt

# load data
data1112 = pd.read_csv("./Data1112.csv")
data1314 = pd.read_csv("./Data1314.csv")
data1516 = pd.read_csv("./Data1516.csv")
data1718 = pd.read_csv("./Data1718.csv")
data = pd.DataFrame( pd.concat( [data1112, data1314, data1516, data1718] ),columns = ["LBDHDD", "LBXTR", "LBDLDL", "HBP"])
data = data.dropna()

ploy = PolynomialFeatures(degree=2)
lr = LogisticRegression()
result = pd.DataFrame()

x_LBDHDD = np.array( data['LBDHDD'] ).reshape(-1, 1)
x_LBXTR = np.array( data['LBXTR'] ).reshape(-1, 1)
x_LBDLDL = np.array( data['LBDLDL'] ).reshape(-1, 1)
Y = np.array(data['HBP'])

result['LBDHDD'] = np.linspace(np.min(data['LBDHDD']), np.max(data['LBDHDD']), 500)
x_ploy = ploy.fit_transform(x_LBDHDD)
lr.fit(x_ploy, Y)
x_ploy = ploy.fit_transform(np.array(result['LBDHDD']).reshape(-1, 1))
result['LBDHDD_SCORE'] = lr.predict_proba( x_ploy )[:, 1]

result['LBXTR'] = np.linspace(np.min(data['LBXTR']), np.max(data['LBXTR']), 500)
x_ploy = ploy.fit_transform(x_LBXTR)
lr.fit(x_ploy, Y)
x_ploy = ploy.fit_transform(np.array(result['LBXTR']).reshape(-1, 1))
result['LBXTR_SCORE'] = lr.predict_proba( x_ploy )[:, 1]

result['x'] = np.linspace(np.min(data['LBDLDL']), np.max(data['LBDLDL']), 500)
x_ploy = ploy.fit_transform(x_LBDLDL)
lr.fit(x_ploy, Y)
x_ploy = ploy.fit_transform(np.array(result['LBDLDL']).reshape(-1, 1))
result['LBDLDL_SCORE'] = lr.predict_proba( x_ploy )[:, 1]

result.to_csv("logisticregression.csv", index=False)


# kriging

library(automap)
library(raster)

library(dplyr)

# データ読み込み ----------------------------------------
# https://dplyr.tidyverse.org/

df <- read.csv("data_鹿児島周辺_220918.csv", header=TRUE)
colnames(df) <- c("name", "kinshitsu_num", "quality_num", "value")

pos <- read.csv("ame_master_20220701.csv", header=TRUE, fileEncoding="shift-jis")
pos <- pos %>% dplyr::select(1,4, 7, 8, 9, 10)
colnames(pos) <- c("pref", "name", "lat_n", "lat_d", "lng_n", "lng_d")
pos <- pos %>% filter(pref=="鹿児島")

df <- df %>% left_join(pos, by = "name") %>% filter(quality_num==8)
df <- df %>% mutate(x = lng_n + lng_d/60)
df <- df %>% mutate(y = lat_n + lat_d/60)

write.csv(df, "_kakunin.csv")

df <- df %>% dplyr::select(x, y, value)

# タイル座標に変換してみる
# https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Coordinates_to_tile_numbers_2
lat_rad <- df$y * pi /180
zl <- 15
n <- 2.0 ^ zl
df$x <- (df$x + 180.0) / 360.0 * n
df$y = (1.0 - log(tan(lat_rad) + (1 / cos(lat_rad))) / pi) / 2.0 * n
df$y = -df$y

#SpatialPointsDataFrame 化
dat.k <- as.data.frame(df)
coordinates(dat.k) = ~x+y 
#dat.k@proj4string <- CRS('+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs')
head(dat.k);plot(dat.k)

# グリッド grid (newdata)  ----------------------------
coord <- coordinates(dat.k)
x.grid <- seq(min(coord[,1]), max(coord[,1]), length=100)
y.grid <- seq(min(coord[,2]), max(coord[,2]), length=100)
grid <- expand.grid(x.grid, y.grid)
colnames(grid) <- c('x','y')
gridded(grid) = ~x+y

# Cross Validation  -------------------------------

cv.o <- autoKrige.cv(value~1, dat.k, model = c('Sph', 'Exp', 'Gau', 'Lin'), verbose=c(TRUE,TRUE)) 
cv.u <- autoKrige.cv(value~x+y, dat.k, model = c('Sph', 'Exp', 'Gau', 'Lin'), verbose=c(TRUE,TRUE)) 
compare.cv(cv.o, cv.u) 

# 普通クリギング Ordinary kriging ----------------------
## kriging実行
kriging_o <- autoKrige(value~1, dat.k, grid, model = c('Sph', 'Exp', 'Gau', 'Lin'), verbose=TRUE) 
plot(kriging_o)
parameters_o <- kriging_o$var_model
attr(parameters_o, "SSErr")

## コンター描画（"raster" package needed）
krig_o <- kriging_o$krige_output
#krig_o@proj4string <- CRS('+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs')
r_o <- raster(krig_o['var1.pred'])
r_o_sd <- raster(krig_o['var1.stdev'])
plot(r_o, main="Ordinary kriging");contour(r_o, col='white', add=T);points(dat.k[,1], dat.k[,2])


# 普遍クリギング Universal kriging ----------------------
## kriging実行
kriging_u <- autoKrige(value~x+y, dat.k, grid, model = c('Sph', 'Exp', 'Gau', 'Lin'), verbose=TRUE) 
plot(kriging_u)
parameters_u <- kriging_u$var_model
attr(parameters_u, "SSErr")

## コンター描画（"raster" package needed）
krig_u <- kriging_u$krige_output
#krig_u@proj4string <- CRS('+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs')
r_u <- raster(krig_u['var1.pred'])
r_u_sd <- raster(krig_u['var1.stdev'])
plot(r_u, main="Universal kriging");contour(r_u, col='white', add=T);points(dat.k[,1], dat.k[,2])


########################################################

# クリギング結果の出力 Output result

p_u <- krig_u@data$var1.pred
gc <- krig_u@coords
res_u <- cbind(gc, p_u)
colnames(res_u) <- c("x", "y", "pred")
write.csv(res_u, "universal_krige.csv", row.names=FALSE)

#######################################################

const gulp = require("gulp");

const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const gWebpack = require("gulp-webpack");
const eslint = require("gulp-eslint");
const webpack = require("webpack");




gulp.task("default", ["lint"], ()=>{
    return gulp.src([
            "src/vines.js"
        ])
        .pipe(gWebpack({
            module: {
                loaders: [{
                    loader: 'babel-loader',
                    query: {
                        presets: ['env']
                    }
                }]
            },
            output: {
                filename: 'vines.js'
            }
        },webpack))
        .pipe(gulp.dest("dist"))
        .pipe(uglify())
        .pipe(concat("vines.min.js"))
        .pipe(gulp.dest("dist"));
});



gulp.task("lint",()=>{
    return gulp.src("src/**.js")
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});
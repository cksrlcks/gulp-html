import gulp from "gulp";
import babel from "gulp-babel";
import fileInclude from "gulp-file-include";
import { deleteAsync } from "del";
import connect from "gulp-connect";

const dirs = {
	src: "src",
	dest: "build",
};

const sources = {
	styles: `${dirs.src}/**/*.css`,
	views: `${dirs.src}/**/*.html`,
	scripts: `${dirs.src}/**/*.js`,
};

// CSS
export const buildCss = () =>
	gulp.src(sources.styles).pipe(gulp.dest(dirs.dest)).pipe(connect.reload());

// HTML
export const buildHtml = () =>
	gulp
		.src([sources.views, "!" + "./src/html/include/*.html"]) //
		.pipe(fileInclude({ prefix: "@@", basepath: "@file" }))
		.pipe(gulp.dest(dirs.dest))
		.pipe(connect.reload());

// JS
export const buildJs = () =>
	gulp
		.src(sources.scripts) //
		.pipe(babel({ presets: ["es2015"] }))
		.pipe(gulp.dest(dirs.dest))
		.pipe(connect.reload());

// Clean
export const clean = () => deleteAsync(["build"]);

// Watch Task
export const devWatch = () => {
	connect.reload();
	gulp.watch(sources.styles, buildCss);
	gulp.watch(sources.views, buildHtml);
	gulp.watch(sources.scripts, buildJs);
};

// server
export const devServer = () => {
	connect.server({
		root: "./build",
		livereload: true,
		port: 8001,
	});
};

export const dev = gulp.series(
	clean,
	gulp.parallel(buildCss, buildHtml, buildJs, devWatch, devServer)
);

export default dev;

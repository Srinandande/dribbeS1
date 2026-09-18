// Package the built game into one HTML file for offline desktop play.
import {readFileSync,writeFileSync} from 'node:fs';
let html=readFileSync('dist/index.html','utf8');
html=html.replace(/<script[^>]*src="([^"]+)"[^>]*><\/script>/,(_,path)=>'<script type="module">'+readFileSync('dist/'+path.replace(/^\.\//,''),'utf8').replace(/<\/script/gi,'<\\/script')+'</script>');
html=html.replace(/<link[^>]*href="([^"]+\.css)"[^>]*>/,(_,path)=>'<style>'+readFileSync('dist/'+path.replace(/^\.\//,''),'utf8')+'</style>');
writeFileSync('dist/Dribble-Streets.html',html);
console.log('Created dist/Dribble-Streets.html');

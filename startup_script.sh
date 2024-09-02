#!/bin/bash 
PORT=3000

while read entry; do
    IFS=' '
    read -ra strarr <<< "$entry"
    echo "Entry: $entry"
    if [[ ${strarr[1]} =~ ^[0-9]+$ ]]; then
        OUTPUT="$(kill -9 ${strarr[1]})"
        echo "killed PID: ${strarr[1]} ${OUTPUT}"
    fi
done < <(lsof -i tcp:$PORT)

while read entry; do
    IFS=' '
    read -ra strarr <<< "$entry"
    echo "Entry: $entry"
    if [[ ${strarr[2]} =~ ^[0-9]+$ ]]; then
        OUTPUT="$(kill -9 ${strarr[2]})"
        echo "killed PID: ${strarr[2]} ${OUTPUT}"
    fi
    if [[ ${strarr[1]} =~ ^[0-9]+$ ]]; then
        OUTPUT="$(kill -9 ${strarr[1]})"
        echo "killed PID: ${strarr[1]} ${OUTPUT}"
    fi
done < <(ps -aef | grep npm)

nohup npm run dev> nohup.out 2>&1 </dev/null &
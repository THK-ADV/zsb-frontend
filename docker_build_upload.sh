#!/bin/sh

img_name=zsb-frontend
packed_name=dist/${img_name}.tar

build() {
    ng build --prod
}

dockerRebuild() {
    docker stop ${img_name}
    docker container rm ${img_name}
    docker image rm ${img_name}
    docker build -t ${img_name} .
}

dockerPackImages() {
    docker save -o ${packed_name} ${img_name}
}

upload() {
  echo start scp &&
  scp ${packed_name} $1 &&
  echo finised scp &&
  rm ${packed_name} &&
  echo removed img file
}

build && dockerRebuild && dockerPackImages && upload $1
tag=$1
username=$2

if [[ -z $tag ]]; then
  echo "No tag was found"
  exit 1
fi

if [[ -z $username ]]; then
  echo "No username was found"
  exit 1
fi

images=("bot" "scraper" "backend")

for image in "${images[@]}"; do
  docker build -t "$image-mm2:$tag" -f "docker/$image.Dockerfile" .  
  docker tag "$image-mm2:$tag" "$username/$image-mm2:$tag"  
  docker push "$username/$image-mm2:$tag"
done

echo "Success"
exit 0
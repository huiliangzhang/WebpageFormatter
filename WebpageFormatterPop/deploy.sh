
rm ../chromeExtension/pop/*
ng build -prod --output-path=../chromeExtension/pop

#add pop folder, for mac
sed -i '' 's/src=\"/src=\"pop\//g' ../chromeExtension/pop/index.html
sed -i '' 's/href=\"styles/href=\"pop\/styles/g' ../chromeExtension/pop/index.html

date

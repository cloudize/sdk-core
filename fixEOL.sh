#!/bin/bash

find src -name "*.js" -type f -exec dos2unix {} \;
find src -name "*.jsx" -type f -exec dos2unix {} \;
find src -name "*.ts" -type f -exec dos2unix {} \;
find src -name "*.tsx" -type f -exec dos2unix {} \;
find tests -name "*.js" -type f -exec dos2unix {} \;
find tests -name "*.jsx" -type f -exec dos2unix {} \;
find tests -name "*.ts" -type f -exec dos2unix {} \;
find tests -name "*.tsx" -type f -exec dos2unix {} \;
# Hi there, Primephonic :)

Quick start

1. **get dependencies**
```npm i```
or
```yarn install```
2. ***build frontend***
```npm run build ```
3. ***start server***
```npm run start```
4. ***in browser go to*** 
```http://localhost:3000```

Here's assignment for full stack dev at Primephonic.
My recruiter told me that assignment would take around 2 hours - so I've not tried to make some endless epic project and made simple stuff that works so to avoid overcoding.

I used ```Vue cli``` and ```Express cli``` to create backbone of project.
Also because project is small - I don't see point in splitting server and client and splitting main Vue component due to - it will result in lesser readability.

Data is stored in data file and interacted with through dataStore module. Timestamp generation for ```stream_started_on``` key is rangelocked between 1st March 2019 and current date so to easily see data difference when using calendar on UI.

Using calendar on UI you can set different starting point for statistics. 
When clearing calendar statistics calculated using all data.
For calendar I've used vuetifyjs lib due to I love material design (and I hope I'm not only one.

Tested on: Ubuntu 18.10, Node 10.13.0, npm 6.8.0, yarn 1.12.3
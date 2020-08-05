# JavaScript simulation of two interacting galaxies

This is a web page that shows a simulation of two interacting galaxies, it's available here:

[https://evgenii.com/blog/two-galaxies/](https://evgenii.com/blog/two-galaxies/)

![Two galaxies simulation](https://github.com/evgenyneu/two_galaxies/raw/master/images_docs/two_galaxies.jpg)


## Run the simulation locally

You can use any local web servers to run the web site locally. Bellow are examples of using Python and Node.js:


### With Python

Install Python and then run

```
python -m http.server
```

Now you can open the web site in your browser using the URL printed in the Terminal, for example `http://0.0.0.0:8000`.


### With Node.js

Install the server

```
npm install http-server -g
```

Run:

```
http-server
```

Now you can open the web site in your browser using the URL printed in the console, for example `http://127.0.0.1:8080`.


## Running unit test

In order to run the unit test, navigate to `/tests` URL path. For example, if you use Python, use [http://0.0.0.0:8000/test](http://0.0.0.0:8000/test)


## The unlicense

This work is in [public domain](LICENSE).

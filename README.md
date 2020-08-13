# Simulation of two interacting galaxies

This is a simulation of two interacting galaxies, written in HTML, CSS and JavaScript:

[https://evgenii.com/blog/two-galaxies/](https://evgenii.com/blog/two-galaxies/)

![Two galaxies simulation](https://github.com/evgenyneu/two_galaxies/raw/master/images_docs/two_galaxies.jpg)


## Run the simulation locally

To run the simulation on your computer, first download this repository (Git needs to be installed):

```
git clone https://github.com/evgenyneu/two_galaxies.git
```

Then change into the `two_galaxies` directory:

```
cd two_galaxies
```

Next, start a web server. You can use any web server to run the web site locally. Bellow are examples of using Python and Node.js:


### With Python

Install Python and then run

```
python -m http.server
```

View the simulation in a web browser at [http://0.0.0.0:8000](http://0.0.0.0:8000).


### With Node.js

Install the server

```
npm install http-server -g
```

Run:

```
http-server
```

View the simulation in a web browser at [http://127.0.0.1:8080](http://127.0.0.1:8080).


## Running unit tests

Open `/test` URL path to run the JavaScript unit tests. For example, if you used the Python web server, open [http://0.0.0.0:8000/test](http://0.0.0.0:8000/test)

## The ammonite 🦑[[link]](https://evgenii.com/files/2020/08/two_galaxies/?numberOfRings=63%2C0&masses=1%2C1&minimalGalaxySeparation=66.48&eccentricity=0.6&ringSeparation=3&ringMultiplier=8&galaxyInclinationAnglesDegree=184%2C115&rotationMatrix=-0.98%2C-0.07%2C-0.09%2C0%2C0.07%2C-0.99%2C0.11%2C0%2C-0.1%2C0.1%2C0.98%2C0%2C0%2C0%2C0%2C1&cameraDistance=431.49)

![The ammonite](https://github.com/evgenyneu/two_galaxies/raw/master/images_docs/ammonite.jpg)



## The unlicense

This work is in [public domain](LICENSE).

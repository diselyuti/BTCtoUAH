# BTCtoUAH

BTCtoUAH is a simple BTC to UAH converter with the ability to send the current
course to subscribed users by email

## Features

- find out the current exchange rate of bitcoin (BTC) in hryvnia (UAH);
- sign an email to receive information on course changes;
- request that will send to all subscribed users
  current course.

## Tech

BTCtoUAH uses a number of open source projects to work properly:

- [ReactJS](https://reactjs.org/) - HTML enhanced for web apps!
- [MUI](https://mui.com/) - great UI boilerplate for modern web apps
- [node.js] - evented I/O for the backend
- [Express] - fast node.js network app framework
- [nodemailer](https://nodemailer.com/about/) - a module to allow easy as cake email sending

And of course BTCtoUAH itself is open source with a [public repository](https://github.com/diselyuti/BTCtoUAH)
on GitHub.

## Installation

BTCtoUAH requires [Node.js](https://nodejs.org/) v16+, [Docker](https://www.docker.com/) v20.10.17+ to run.

Clone a project from the [repository](https://github.com/diselyuti/BTCtoUAH) with submodules

```sh
git clone --recurse-submodules https://github.com/diselyuti/BTCtoUAH
```

If you forgot to use --recurse-submodules, no problem:

```sh
git clone https://github.com/diselyuti/BTCtoUAH
cd BTCtoUAH
git submodule init
git submodule update
```

And then at BTCtoUAH directory run:
```sh
docker-compose up --build
```

Great! Now you can check your site at http://localhost:3050


If anything goes wrong, try again, then contact me: dima.selyutin.03@gmail.com



## License

MIT

**Free Software, Hell Yeah!**

[//]: #
[node.js]: <http://nodejs.org>
[express]: <http://expressjs.com>

---
publishDate: 2019-04-22
title: Simple Shell Random Password Generator
excerpt: Generate strong passwords quickly with this Bash one-liner.
image: ~/assets/images/code-large.jpg
category: Tutorial
tags: [Linux, Bash, Shell, Terminal, Efficiency, Tips, Password, Security, One-Liner]
---

## Generate a Random Password in Bash

Need a strong password fast? Here's a simple Bash one-liner:

```bash
#!/bin/bash

# Function to generate a 32 character random password
randomPass() {

 #Set local variable for password
 local randompass=$(cat /dev/urandom | env LC_CTYPE=C tr -dc 'a-zA-Z0-9!@#$%^&*()_+?><~\`;' | fold -w 32 | head -n 1)

 echo $randompass
}

randomPass
```

## Quick one-liner

```bash
[ "$(uname)" = "Darwin" ] && export LC_CTYPE=C || export LC_ALL=C; cat /dev/urandom | tr -dc 'a-zA-Z0-9!@#$%^&*()_+?><~\`;' | fold -w 32 | head -n 1

```

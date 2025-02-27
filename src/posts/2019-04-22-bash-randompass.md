---
publishDate: 2019-04-22
title: Simple Shell Random Password Generator
excerpt: Generate strong passwords quickly with this Bash one-liner.
image: ~/assets/images/code-large.jpg
category: Tutorial
tags: [Linux, Bash, Shell, Terminal, Efficiency, Tips, Password, Security, One-Liner]
---

## Need a Random Password Quick? Look No Further

Here's a simple Bash one-liner:

```bash
[ "$(uname)" = "Darwin" ] && export LC_CTYPE=C || export LC_ALL=C; cat /dev/urandom | tr -dc 'a-zA-Z0-9!@#$%^&*()_+?><~\`;' | fold -w 32 | head -n 1

```

## Function for Reusability

For situations where you need to generate multiple random passwords, or if you want to reuse the password generation logic in other scripts, you can use a function:

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

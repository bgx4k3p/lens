---
publishDate: 2023-10-27
title: 'Free Up Disk Space Safely: How to Uninstall Old Kernels on Ubuntu - A Step-by-Step Guide'
excerpt: 'Ubuntu running out of space?  Reclaim valuable disk space by safely removing old, unused kernels. This step-by-step guide ensures a clean and risk-free kernel cleanup.'
image: ~/assets/images/code-large.jpg
category: Tutorial
tags: [Linux, Bash, Shell, Productivity, Terminal, Tips]
---

## Reclaiming Your Disk: The Kernel Cleanup

Over time, Ubuntu systems accumulate older Linux kernels, each taking up valuable disk space. If you're facing disk space constraints, or simply want to keep your system lean and tidy, removing these old kernels is a smart move. This guide will walk you through a **safe and step-by-step process** to uninstall old kernels on Ubuntu selectively, ensuring you keep your system running smoothly and avoid any boot issues.

## Step 1: Identify Your Currently Running Kernel

Before you even think about uninstalling anything, it's absolutely crucial to identify the **kernel version your Ubuntu system is currently using**. **You must NOT remove this kernel!** Removing the active kernel will prevent your system from booting.

Open your terminal and run the following command:

```sh
uname -r
```

This command will display the version name of your active kernel, for example: `5.15.0-84-generic`. **Write this version down** or keep it handy – it's your "do-not-remove" version.

## Step 2: List All Installed Kernels

Now, let's get a clear picture of all the kernel packages currently installed on your system. This will show us the list of potential candidates for removal (excluding the one you just identified in Step 1).

Execute this command in your terminal:

```sh
dpkg --list | grep linux-image
```

This command will list all packages with names starting with `linux-image`, which are the kernel image packages. The output will look something like this (the versions will vary):

```sh
ii  linux-image-5.15.0-76-generic           5.15.0-76.83+esm1                  amd64        Signed kernel image generic
ii  linux-image-5.15.0-83-generic           5.15.0-83.92                         amd64        Signed kernel image generic
ii  linux-image-5.15.0-84-generic           5.15.0-84.93                         amd64        Signed kernel image generic
ii  linux-image-generic                     5.15.0.84.85                         amd64        Generic Linux kernel image
```

Carefully examine this list and compare the versions to your currently running kernel (from Step 1). You'll notice older versions that are candidates for removal (e.g., `linux-image-5.15.0-76-generic` and `linux-image-5.15.0-83-generic` in this example, assuming the running kernel is `5.15.0-84-generic`).

## Step 3: Option 1 (Cautious & Recommended): Manual Removal of Old Kernels

For maximum safety and control, the **recommended approach is to manually remove old kernels one by one** using the `apt-get purge` command. This allows you to double-check each kernel version before removing it.

Use the following command, **replacing `X.X.X-X-generic` with the _exact version_ of the kernel you want to uninstall** (from the list in Step 2, and ensuring it's _not_ your running kernel from Step 1!):

```sh
sudo apt-get purge linux-image-X.X.X-X-generic
```

**Example:** To remove `linux-image-5.15.0-76-generic`, you would run:

```sh
sudo apt-get purge linux-image-5.15.0-76-generic
```

**Repeat this command for each old kernel version you want to remove.** **Double-check the version each time before you execute the `purge` command!**

## Step 4: Option 2 (Use with Caution!) The One-Liner for Faster Removal

For experienced users who are comfortable with complex command lines and want a potentially faster (but slightly less cautious) method, you can use the following one-liner. **Use this with caution and only if you fully understand what it does!**

```sh
echo $(dpkg --list | grep linux-image | awk '{ print $2 }' | sort -V | sed -n '/'`uname -r`'/q;p') $(dpkg --list | grep linux-headers | awk '{ print $2 }' | sort -V | sed -n '/'"$(uname -r | sed "s/\([0-9.-]*\)-\([^0-9]\+\)/\1/")"'/q;p') | xargs sudo apt-get -y purge
```

**Before running this one-liner:**

- **Understand that it removes old _kernel images_ AND _kernel headers_.**
- **It _attempts_ to automatically exclude your running kernel.** However, always double-check the list of packages to be removed before confirming (even with `-y`). **Ideally, run it _without_ `| xargs sudo apt-get -y purge` first** to see the list of packages that _would_ be removed, and then carefully review that list.
- **Be aware of the `sudo apt-get -y purge` part**: `-y` automatically answers "yes" to prompts, which means the removal will happen without further confirmation from you once `xargs` passes the package list.

**To use the one-liner cautiously:**

1. **Run the command _without_ the final `| xargs sudo apt-get -y purge` part first:**

   ```sh
   echo $(dpkg --list | grep linux-image | awk '{ print $2 }' | sort -V | sed -n '/'`uname -r`'/q;p') $(dpkg --list | grep linux-headers | awk '{ print $2 }' | sort -V | sed -n '/'"$(uname -r | sed "s/\([0-9.-]*\)-\([^0-9]\+\)/\1/")"'/q;p')
   ```

2. **Carefully review the output.** This output will be a list of kernel image and header packages that the one-liner _intends_ to remove. **Ensure your currently running kernel version is NOT in this list!** If you are unsure, **do NOT proceed with the next step and prefer manual removal (Option 1).**

3. **If you are confident the list is correct**, then you can append `| xargs sudo apt-get -y purge` to the command and execute the full one-liner to perform the removal.

## Step 5: Clean Up Residual and Orphaned Packages

After purging the old kernel packages, it's good practice to clean up any residual dependencies and orphaned packages that might be lingering. This helps free up even more disk space.

Run the following commands:

```sh
sudo apt-get autoremove
sudo apt-get clean
```

- **`sudo apt-get autoremove`**: This command removes packages that were automatically installed to satisfy dependencies and are no longer needed because those dependencies are now removed.
- **`sudo apt-get clean`**: This command cleans out the local repository of downloaded package files that are no longer needed.

## Step 6: Reboot (Recommended)

While not always strictly necessary immediately after removing kernels, **rebooting your system is generally recommended** after kernel uninstallation. This ensures that the system fully recognizes the changes, updates the boot menu (GRUB), and operates cleanly without the removed kernels.

```sh
sudo reboot
```

## Final Thoughts: Maintain a Lean and Healthy Ubuntu System

Regularly cleaning up old kernels is an excellent practice for maintaining a lean, efficient, and well-organized Ubuntu system, especially on systems with limited disk space. By following these steps, you can safely reclaim valuable space and keep your system running smoothly.

**Remember**: Always exercise caution when removing system components like kernels. Double-check versions, and when in doubt, opt for the safer, manual removal method. It's better to be safe than sorry when it comes to your kernel! And always keep at least one older kernel as a fallback, just in case.

## Next Steps

- **Automate Cleanup (Advanced):** For advanced users, explore automating kernel cleanup using scripts and systemd timers for regular maintenance.
- **Monitor Disk Usage Regularly:** Get in the habit of monitoring your disk space usage to proactively identify and address potential space issues.
- **Learn More about Kernel Management:** Dive deeper into Ubuntu kernel management, update processes, and GRUB configuration for a more comprehensive understanding of your system's core.

---
publishDate: 2023-10-27
title: 'Supercharge Your VMware Security:  Command-Line Guide to ESXi Updates'
excerpt: 'Bolster your VMware Infrastructure security posture by installing the latest ESXi updates'
image: ~/assets/images/esxi.jpg
category: Tutorial
tags: [VMware, ESXi, Update, Patch, Shell, Security, Terminal]
---

## Unlocking ESXi Security: The Command-Line Edge

Maintaining up-to-date VMware ESXi hosts is essential for a secure and stable virtual environment. While vSphere offers a graphical interface, the command line provides a faster and more efficient update method. For users of free ESXi, such as in home lab environments, the command line is a direct option for patch installation. This tutorial guides you through the essential steps to update ESXi hosts directly from the command line, providing a valuable skill for efficient VMware administration.

## 1. Initiate Maintenance Mode: Prepare for a Smooth Update

While updates _can_ be applied without maintenance mode, placing your ESXi host in maintenance mode is the best practice for a safe and controlled update process. It ensures no VMs are running and potentially impacted during the update.

First, gracefully shut down all running virtual machines on the ESXi host. Once VMs are powered off, execute the following commands via SSH to enter maintenance mode:

```bash
esxcli system maintenanceMode set --enable=true
esxcli system maintenanceMode get
```

The `esxcli system maintenanceMode get` command is used to verify that the host has successfully entered maintenance mode.

## 2. Enable Outbound HTTP Access: Open the Update Pipeline

To fetch updates from VMware's online depot, your ESXi host needs to be able to make outbound HTTP requests. If your environment restricts outbound traffic by default, you'll need to temporarily allow HTTP access for the update process.

Use the following command to enable outbound HTTP requests through the ESXi firewall:

```bash
esxcli network firewall ruleset set -e true -r httpClient
```

Remember to disable this rule after the update is complete (covered in step 6) to maintain a secure configuration.

## 3. Discover Available ESXi Profiles: Choose Your Update Wisely

VMware provides various ESXi profiles for different build versions and patch levels. Before applying an update, it's crucial to list the available profiles to select the correct one for your needs.

Run the following command to retrieve a list of available ESXi profiles from the VMware online depot, filtering for standard profiles:

```bash
esxcli software sources profile list --depot=[https://hostupdate.vmware.com/software/VUM/PRODUCTION/main/vmw-depot-index.xml](https://hostupdate.vmware.com/software/VUM/PRODUCTION/main/vmw-depot-index.xml) |grep ESXi-7|grep standard
```

**Example Output (Output may vary depending on the latest available profiles):**

```bash
ESXi-7.0.0-15843807-standard      VMware, Inc.  PartnerSupported  2020-03-16T10:48:54  2020-03-16T10:48:54
ESXi-7.0bs-16321839-standard      VMware, Inc.  PartnerSupported  2020-06-02T05:57:00  2020-06-02T05:57:00
ESXi-7.0b-16324942-standard       VMware, Inc.  PartnerSupported  2020-06-02T17:26:43  2020-06-02T17:26:43
ESXi-7.0U1b-17168206-standard     VMware, Inc.  PartnerSupported  2020-11-11T11:34:51  2020-11-11T11:34:51
ESXi-7.0U1d-17551050-standard     VMware, Inc.  PartnerSupported  2021-02-01T18:29:07  2021-02-01T18:29:07
ESXi-7.0U1c-17325551-standard     VMware, Inc.  PartnerSupported  2020-12-15T12:44:19  2020-12-15T12:44:19
ESXi-7.0U1a-17119627-standard     VMware, Inc.  PartnerSupported  2020-11-01T08:18:49  2020-11-01T08:18:49
ESXi-7.0.1-16850804-standard      VMware, Inc.  PartnerSupported  2020-09-04T18:28:17  2020-09-04T18:28:18
ESXi-7.0U1sc-17325020-standard    VMware, Inc.  PartnerSupported  2020-12-15T10:50:21  2020-12-15T10:50:21
ESXi-7.0U2a-17867351-standard     VMware, Inc.  PartnerSupported  2021-04-29T00:00:00  2021-04-29T00:00:00
ESXi-7.0U2sc-18295176-standard    VMware, Inc.  PartnerSupported  2021-08-24T00:00:00  2021-08-24T00:00:00
ESXi-7.0U2c-18426014-standard     VMware, Inc.  PartnerSupported  2021-08-24T00:00:00  2021-08-24T00:00:00
ESXi-7.0U2d-18538813-standard     VMware, Inc.  PartnerSupported  2021-09-14T00:00:00  2021-09-14T00:00:00
```

Carefully review the output and identify the latest profile based on the release date and build number. In the example output, `ESXi-7.0U2d-18538813-standard` appears to be the most recent.

## 4. Perform a Dry Run (Recommended Safety Check)

Before committing to the actual update, it's highly recommended to perform a dry run. This simulates the update process without making any permanent changes, allowing you to identify potential issues beforehand.

Execute the following command, replacing `ESXi-7.0U2d-18538813-standard` with the profile you selected in the previous step:

```bash
esxcli software profile update -d [https://hostupdate.vmware.com/software/VUM/PRODUCTION/main/vmw-depot-index.xml](https://hostupdate.vmware.com/software/VUM/PRODUCTION/main/vmw-depot-index.xml) -p ESXi-7.0U2d-18538813-standard --dry-run
```

Carefully examine the output of the dry run for any warnings or errors. Address any reported issues before proceeding with the actual update.

## 5. Apply the Update: Execute the Command-Line Upgrade

Once you've reviewed the dry run and are confident in proceeding, execute the update command. This command is identical to the dry run command, but without the `--dry-run` flag.

This is the moment of action! Execute the command and let the command line work its magic to update your ESXi host.

```bash
esxcli software profile update -d [https://hostupdate.vmware.com/software/VUM/PRODUCTION/main/vmw-depot-index.xml](https://hostupdate.vmware.com/software/VUM/PRODUCTION/main/vmw-depot-index.xml) -p ESXi-7.0U2d-18538813-standard
```

The update process will take some time to complete, depending on your network speed and the size of the update. Monitor the progress in the command-line interface.

## 6. Disable Outbound HTTP Access: Re-establish Firewall Security

After the update is successfully applied, it's crucial to re-enable your firewall restrictions and disable outbound HTTP access that was temporarily allowed in step 2.

Use the following command to disable outbound HTTP requests:

```bash
esxcli network firewall ruleset set -e false -r httpClient
```

## 7. Reboot Your ESXi Host: Finalize the Update

A reboot is required to finalize the update process and ensure all changes are properly applied.

Reboot your ESXi host using the command:

```bash
reboot
```

## 8. Post-Update Verification & Troubleshooting

After the reboot, verify that the update was successful. Check the ESXi build number in the vSphere Client or via the command line (`vmware -v`). Also, thoroughly test your virtual machines and ESXi host functionality to ensure everything is operating as expected.

Even with careful preparation, issues can sometimes arise. Here are a couple of common scenarios and troubleshooting tips:

### Common Error: "No space left on device" during update

This error often indicates insufficient space in the `/locker` partition, which is used for VMware Tools.

```bash
# Common error message:
[InstallationError]
[Errno 28] No space left on device
       vibs = VMware_locker_tools-light_11.0.5.15389592-15999342
```

**Workaround:** If you encounter this error, try updating the ESXi host _without_ the VMware Tools package initially, and then install the tools separately afterwards.

```bash
# Install update without tools (example for ESXi 6.7 - adjust profile name accordingly)
esxcli software profile update -d [https://hostupdate.vmware.com/software/VUM/PRODUCTION/main/vmw-depot-index.xml](https://hostupdate.vmware.com/software/VUM/PRODUCTION/main/vmw-depot-index.xml) -p ESXi-6.7.0-20191204001-no-tools

# After successful update, install VMware Tools separately
esxcli software vib install -v [https://hostupdate.vmware.com/software/VUM/PRODUCTION/main/esx/vmw/vib20/tools-light/VMware_locker_tools-light_11.0.5.15389592-15999342.vib](https://hostupdate.vmware.com/software/VUM/PRODUCTION/main/esx/vmw/vib20/tools-light/VMware_locker_tools-light_11.0.5.15389592-15999342.vib)
```

You can find the specific VMware Tools VIB URL on the VMware Customer Connect portal or by browsing the update depot.

### Hardware Compatibility Warnings: CPU Support

In some cases, you might encounter hardware compatibility warnings, particularly with older CPUs.

```bash
# Hardware Compatibility Warning Example:
[HardwareError]
 Hardware precheck of profile ESXi-7.0U2d-18538813-standard failed with warnings: <CPU_SUPPORT WARNING: The CPU in this host may not be supported in future ESXi releases. Please plan accordingly.>
```

If you are aware of the hardware limitations and are willing to proceed, you can add the `--no-hardware-warning` flag to bypass this warning and continue with the update.

```bash
# Ignore hardware warnings and proceed with update (use with caution!)
esxcli software profile update -d [https://hostupdate.vmware.com/software/VUM/PRODUCTION/main/vmw-depot-index.xml](https://hostupdate.vmware.com/software/VUM/PRODUCTION/main/vmw-depot-index.xml) -p ESXi-7.0U2d-18538813-standard --no-hardware-warning
```

**Use the `--no-hardware-warning` flag with caution and only if you understand the implications and are prepared to address potential hardware compatibility issues.**

## Conclusion: Command-Line ESXi Updates: Efficiency and Control in Your Hands

Mastering command-line ESXi updates empowers you with a faster, more efficient, and scriptable method for patching your VMware environment. By following these steps, you can confidently keep your ESXi hosts secure and up-to-date, ensuring the robust foundation of your virtual infrastructure.

**Embrace the command line and become an ESXi update ninja!**

**Next Steps:**

- **Automate ESXi Updates:** Explore scripting and automation tools (like PowerCLI or Ansible) to further streamline and automate ESXi patching in your environment.
- **Regularly Review VMware Security Advisories:** Stay informed about the latest security vulnerabilities and proactively plan your patching schedule.
- **Practice Command-Line Updates in a Test Environment:** Familiarize yourself with the command-line update process in a non-production environment before applying updates to critical production hosts.

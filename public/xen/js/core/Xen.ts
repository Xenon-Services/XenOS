const fs = require("./FileSystem");
const wm = require("./WindowManager");
const loader = require("./Loader");
const cookie = require("js-cookie");

window.path = require("path-browserify");

interface Window {
    xen: Xen;
    path: any;
}

interface FileSystem {
    loading: Promise<void>;
    readFile(path: string): Promise<string>;
    writeFile(path: string, data: string): Promise<void>;
    unlink(path: string): Promise<void>;
    openDir(path: string): Promise<void>;
    exists(path: string): Promise<boolean>;
    mkdir(path: string): Promise<void>;
    stat(path: string): Promise<any>;
}


class Xen {
    fs: FileSystem = new fs();
    wm = new wm();
    loader = new loader();

    async startup() {
        await this.fs.loading;
        await this.wm.init();

        if (cookie.get("fs-initiated") !== "true") {
            await this.stupFileSystem();

            cookie.set(
                "fs-initiated",
                "true",
                {
                    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10),
                    secure: true,
                    sameSite: "strict"
                }
            );
        }

        await this.loader.init(
            "components/apps.js",
            "components/taskbar.js",
            "components/battery.js"
        );

        return true;
    }

    async stupFileSystem() {
        const vfs = this.fs;

        // General Files
        await vfs.mkdir("/xen");
        await vfs.mkdir("/xen/system");
        await vfs.mkdir("/xen/users");

        // Use Guest as a placeholder
        await vfs.mkdir("/xen/users/guest");
        await vfs.mkdir("/xen/users/guest/desktop");
        await vfs.mkdir("/xen/users/guest/documents");
        await vfs.mkdir("/xen/users/guest/downloads");
        await vfs.mkdir("/xen/users/guest/music");
        await vfs.mkdir("/xen/users/guest/pictures");
        await vfs.mkdir("/xen/users/guest/videos");

        // Taskbar files
        await vfs.mkdir("/xen/system/taskbar");

        await vfs.writeFile("/xen/system/taskbar/pinned.json", [
            {
                name: "VSCode",
                icon: "/xen/img/app/code.png",
            },
            {
                name: "Spotify",
                icon: "/xen/img/app/spotify.png",
            },
            {
                name: "Discord",
                icon: "/xen/img/app/discord.png",
            },
            {
                name: "Roblox",
                icon: "/xen/img/app/roblox.jpg",
            },
            {
                name: "GEForce Now",
                icon: "/xen/img/app/geforce.png",
            },
            {
                name: "Stack Overflow",
                icon: "/xen/img/app/stack.svg",
            }
        ] as any);

        // App files

        await vfs.mkdir("/xen/system/apps");

        await vfs.writeFile("/xen/system/apps/installed.json", [

        ] as any);

        return true;
    };

    hideLoader() {
        const loader = document.getElementById("os-pre");

        if (!loader) return;

        loader.animate(
            [
                {
                    opacity: 1,

                },
                {
                    opacity: 0,
                }
            ],
            {
                duration: 500,
                easing: "ease-in-out",
            }
        );

        setTimeout(() => {
            loader.style.display = "none";
        }, 500);
    }
}

module.exports = Xen;
import hello from "./utilities/hello";

export const run = (argv: string[]) => {
    hello();
    console.log("argv", argv);
};

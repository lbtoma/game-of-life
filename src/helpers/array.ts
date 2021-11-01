export const range = (
  ...args: [number] | [number, number] | [number, number, number]
) => {
  switch (args.length) {
    case 2:
      return [...new Array(args[1] - args[0]).keys()].map((n) => n + args[0]);
    case 3:
      const len = Math.ceil((args[1] - args[0]) / args[2]);
      const bias = Math[args[2] > 0 ? "min" : "max"](args[0], args[1]);

      return [...new Array(len).keys()].map((n) => n * args[2] + bias);
    default:
      return [...new Array(args[0]).keys()];
  }
};

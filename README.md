# Every Branches Image

A website that lists every image file in [BFDI: Branches](https://teambranches.itch.io/bfdi-branches) and [Barfy's Adventure](https://barfy.itch.io/adventure), usable for NPCs/UI and profile bios in the former and profile bios in the latter.

## Building

First, decompile Branches (there are tools for that), and create a `decomp` folder and put your decomp there (directly, so `decomp/global.gd` should exit). You'll also need a relatively recent version Node.js installed.

Then, in a command prompt, navigate to this repo's folder and run `node generate.mjs`.

For the Barfy's Adventure assets, same story, but with a `ba_decomp` folder and `node generate_ba.mjs` (But do make sure to decompile the `game.pck` file, not the launcher's `BarfysAdventure.pck`!).

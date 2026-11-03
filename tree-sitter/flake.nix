{
  description = "Development tools for the Tamarin tree-sitter grammar";

  inputs.nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  inputs.flake-parts.url = "github:hercules-ci/flake-parts";
  inputs.tree-sitter = {
    url = "github:tree-sitter/tree-sitter/v0.27.1";
    inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs =
    { flake-parts, ... }@inputs:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = [
        "aarch64-darwin"
        "aarch64-linux"
        "x86_64-darwin"
        "x86_64-linux"
      ];

      perSystem =
        { pkgs, system, ... }:
        {
          _module.args.pkgs = import inputs.nixpkgs {
            inherit system;
            overlays = [
              # Add overlays as needed
            ];
          };

          devShells.default = pkgs.mkShell {
            TREE_SITTER = "${inputs.tree-sitter.packages.${system}.cli}/bin/tree-sitter";
            packages = with pkgs; [
              inputs.tree-sitter.packages.${system}.cli
              nodejs
              python3
              gnumake
            ];
          };

          formatter = pkgs.nixfmt-tree;
        };
    };
}
